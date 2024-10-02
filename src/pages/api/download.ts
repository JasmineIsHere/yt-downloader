import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import * as fs from "fs";
import { COOKIES } from "@/utils/jsonParser";
import path from "path";

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
      const outputPath = `${path.join(
        process.cwd(),
        "public",
        type === "audio" ? "audio.mp3" : "video.mp4"
      )}`;
      console.log("outputpath:", outputPath);
      const agent = ytdl.createAgent(COOKIES);

      ytdl(url, { filter: filter, agent })
        .pipe(fs.createWriteStream(outputPath))
        .on("finish", () => {
          console.log("Write finished")
          const stat = fs.statSync(outputPath);
          res.writeHead(200, {
            "Content-Type": type === "audio" ? "audio/mp3" : "video/mp4",
            "Content-Length": stat.size,
          });
          fs.createReadStream(outputPath).pipe(res);
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