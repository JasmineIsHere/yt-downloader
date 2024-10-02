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
        "Content-Type": "video/mp4",
      });
      ytdl(url, { filter: filter, agent })
        .pipe(res)
        .on("finish", () => {
          console.log("pipe finished");
          res.end();
        })
        .on("error", (error) => {
          res
            .status(500)
            .json({ error: "Error downloading video", description: error });
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error downloading video", description: error });
    }
}

export const config = {
  api: {
    externalResolver: true,
  },
}