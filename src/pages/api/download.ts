import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import * as fs from "fs";
import { COOKIES } from "@/utils/jsonParser";

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
    const agent = ytdl.createAgent(COOKIES);

    ytdl(url, { filter: filter, agent })
    .pipe(
      fs.createWriteStream(outputPath))
    .on("finish", () => {
      res.status(200).json(outputPath);
    })
    .on("error", (error) => {
      res.status(500).json({ error: "Error downloading video", description: error });
    });
  } catch (error) { 
    res.status(500).json({ error: "Error downloading video", description: error });
  }
}