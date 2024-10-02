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
      const stream = ytdl(url, { filter: filter, agent });

      stream.on("response", (response) => {
        console.log("event listener response:", response);
        res.writeHead(200, {
          "Content-Type": type === "audio" ? "audio/mpeg" : "video/mp4",
          "Content-Length": response.headers["content-length"],
        });
      });

      stream.pipe(res).on("error", (error) => {
        res
          .status(500)
          .json({ error: "Error downloading video", description: error });
      });

      // res.writeHead(200, {
      //       "Content-Type": type === "audio" ? "audio/mpeg" : "video/mp4",
      //       // "Content-Length": stat.size,
      //     });
      // ytdl(url, { filter: filter, agent })
      //   .pipe(res)
      //   .on("finish", () => {
      //     res.end();
      //   })
      //   .on("error", (error) => {
      //     res
      //       .status(500)
      //       .json({ error: "Error downloading video", description: error });
      //   });
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