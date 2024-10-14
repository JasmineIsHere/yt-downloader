import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import { COOKIES } from "@/utils/jsonParser";

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
    const agent = ytdl.createAgent(COOKIES);
    const videoInfo = await ytdl.getBasicInfo(url, { agent });
    const title = videoInfo.videoDetails.title;
    const thumbnail = videoInfo.videoDetails.thumbnails[0].url;
    res.status(200).json({ title, thumbnail, videoInfo});
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: "Error converting video, please try again later",
      description: err,
    });
  }
}
