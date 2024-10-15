import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "@distube/ytdl-core";
import { COOKIES } from "@/utils/jsonParser";
import { format } from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, type } = req.query;
  // const filter = type === "audio" ? "audioonly" : "audioandvideo";
  // const options = {
  //   filter : filter,
  //   quality: "highestaudio",
  //   requestOptions: {
  //     headers: {
  //       cookie: COOKIES,
  //     },
  //   },
  // }
  // { filter: filter, agent, dlChunkSize: 0 }
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
    // console.log("downloading video; create agent");

    res.writeHead(200, {
      "Content-Type": type === "audio" ? "audio/wav" : "video/mp4",
    });
    console.log("downloading video; write head");
    ytdl(url, {
      agent,
      filter: format => format.container === 'mp4',
    })
      .pipe(res)
      .on("finish", () => {
        console.log("pipe finished");
        res.end();
      })
      .on("error", (error) => {
        console.log("pipe error:", error);
        res
          .status(500)
          .json({ error: "Error downloading video", description: error });
      });
  } catch (error) {
    console.log("error:", error);
    res
      .status(500)
      .json({ error: "Error downloading video", description: error });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
