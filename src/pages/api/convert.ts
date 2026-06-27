import type { NextApiRequest, NextApiResponse } from "next";
import { Innertube } from "youtubei.js";

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

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

  const videoId = extractVideoId(url);
  if (!videoId) {
    res.status(400).json({ error: "Could not extract video ID from URL" });
    return;
  }

  try {
    const yt = await Innertube.create();
    const info = await yt.getBasicInfo(videoId);
    const title = info.basic_info.title;
    const thumbnail = info.basic_info.thumbnail?.[0]?.url;
    res.status(200).json({ title, thumbnail });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Error converting video, please try again later",
      description: err,
    });
  }
}
