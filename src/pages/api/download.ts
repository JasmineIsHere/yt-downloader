import { NextApiRequest, NextApiResponse } from "next";
import { ytdlp } from "@/utils/ytdlp";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { spawn } from "child_process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, type } = req.query;

  if (
    !url ||
    typeof url !== "string" ||
    (!url.includes("youtube.com") && !url.includes("youtu.be"))
  ) {
    res.status(404).json({ error: "Error downloading video" });
    return;
  }

  try {
    if (type === "audio") {
      res.writeHead(200, { "Content-Type": "audio/mp3" });

      // --extract-audio doesn't work with stdout; pipe bestaudio into ffmpeg instead
      const ytdlpProc = ytdlp(url, [
        "--format", "bestaudio",
        "--output", "-",
        "--quiet",
      ]);

      const ffmpegProc = spawn(ffmpegInstaller.path, [
        "-i", "pipe:0",
        "-vn",
        "-acodec", "libmp3lame",
        "-ab", "128k",
        "-f", "mp3",
        "pipe:1",
      ]);

      ytdlpProc.stdout.pipe(ffmpegProc.stdin);
      ffmpegProc.stdout.pipe(res);

      ytdlpProc.stderr.on("data", (chunk) => console.error("[yt-dlp]", chunk.toString()));
      ffmpegProc.stderr.on("data", (chunk) => console.error("[ffmpeg]", chunk.toString()));

      ffmpegProc.on("close", () => res.end());
      ffmpegProc.on("error", (err) => { console.error("ffmpeg error:", err); res.end(); });
      ytdlpProc.on("error", (err) => { console.error("yt-dlp error:", err); res.end(); });
    } else {
      res.writeHead(200, { "Content-Type": "video/mp4" });

      const proc = ytdlp(url, [
        "--format", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "--output", "-",
        "--quiet",
      ]);

      proc.stdout.pipe(res);
      proc.stderr.on("data", (chunk) => console.error(chunk.toString()));
      proc.on("close", () => res.end());
      proc.on("error", (err) => {
        console.log("yt-dlp error:", err);
        res.end();
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Error downloading video" });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
