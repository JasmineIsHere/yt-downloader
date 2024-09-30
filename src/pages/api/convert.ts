import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (
    !url ||
    typeof url !== "string" ||
    (!url.includes("youtube.com") && !url.includes("youtu.be"))
  ) {
    res.status(404).json({ error: "Please provide a valid YouTube URL" });
    return;
  }
  try {
    const videoInfo = await ytdl.getBasicInfo(url);
    const title = videoInfo.videoDetails.title;
    const thumbnail = videoInfo.videoDetails.thumbnails[0].url;
    res.status(200).json({ title, thumbnail });
  } catch {
    res.status(500).json({ error: "Please provide a valid YouTube URL" });
  }
}