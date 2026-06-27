import type { NextApiRequest, NextApiResponse } from "next";
import ytDlp from "yt-dlp-exec";

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
    const info = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
    }) as Record<string, any>;

    res.status(200).json({
      title: info.title,
      thumbnail: info.thumbnail,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Error fetching video info, please try again later",
    });
  }
}
