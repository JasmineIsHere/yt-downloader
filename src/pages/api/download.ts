import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import * as fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, type } = req.query;
  const filter = type === "audio" ? "audioonly" : "audioandvideo";
  if (
    !url ||
    typeof url !== "string" ||
    (!url.includes("youtube.com") && !url.includes("youtu.be"))
  ) {
    res.status(404).json({ error: "Error downloading video" });
    return;
  }
  try {
    const outputPath = `public/${type === "audio" ? "audio.mp3" : "video.mp4"}`;
    ytdl(url, { filter: filter })
    .pipe(
      fs.createWriteStream(outputPath))
    .on("finish", () => {
      res.status(200).json(outputPath);
    })
    .on("error", () => {
      res.status(500).json({ error: "Error downloading video" });
    });
  } catch { 
    res.status(500).json({ error: "Error downloading video" });
  }
}