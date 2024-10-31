import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import { COOKIES } from "@/utils/jsonParser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const agent = ytdl.createAgent(COOKIES);

    res.writeHead(200, {
      "Content-Type": type === "audio" ? "audio/mp3" : "video/mp4",
    });
    ytdl(url, {
      agent,
      filter: filter,
      quality: "highest",
    })
      .pipe(res)
      .on("end", () => {
        console.log("pipe finished");
        res.end();
      })
      .on("error", (error) => {
        console.log("pipe error:", error);
        res
          .status(500)
          .json({ error: "Error downloading video", description: error });
        res.end();
      });
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({ error: "Error downloading video", description: error });
    res.end();
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
