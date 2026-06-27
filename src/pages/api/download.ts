import { NextApiRequest, NextApiResponse } from "next";
import ytDlp from "yt-dlp-exec";
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

      const proc = ytDlp.exec(url, {
        extractAudio: true,
        audioFormat: "mp3",
        audioBitrate: "128",
        ffmpegLocation: ffmpegDir,
        output: "-",
        quiet: true,
      });

      proc.stdout!.pipe(res);
      proc.on("close", () => res.end());
      proc.on("error", (err) => {
        console.log("yt-dlp error:", err);
        res.end();
      });
    } else {
      res.writeHead(200, { "Content-Type": "video/mp4" });

      const proc = ytDlp.exec(url, {
        format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        output: "-",
        quiet: true,
      });

      proc.stdout!.pipe(res);
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
