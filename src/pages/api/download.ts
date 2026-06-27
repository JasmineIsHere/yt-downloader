import { NextApiRequest, NextApiResponse } from "next";
import { ytdlp } from "@/utils/ytdlp";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";

const ffmpegDir = path.dirname(ffmpegInstaller.path);

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

      const proc = ytdlp(url, [
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "128K",
        "--ffmpeg-location", ffmpegDir,
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
