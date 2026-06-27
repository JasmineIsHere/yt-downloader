import { NextApiRequest, NextApiResponse } from "next";
import { Innertube } from "youtubei.js";
import { Readable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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
  const { url, type } = req.query;

  if (
    !url ||
    typeof url !== "string" ||
    (!url.includes("youtube.com") && !url.includes("youtu.be"))
  ) {
    res.status(404).json({ error: "Error downloading video" });
    return;
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    res.status(400).json({ error: "Could not extract video ID" });
    return;
  }

  try {
    const yt = await Innertube.create();

    if (type === "audio") {
      const stream = await yt.download(videoId, {
        type: "audio",
        quality: "best",
        format: "any",
        client: "IOS",
      });

      const nodeStream = Readable.fromWeb(stream as Parameters<typeof Readable.fromWeb>[0]);

      res.writeHead(200, { "Content-Type": "audio/mp3" });
      ffmpeg(nodeStream)
        .audioBitrate(128)
        .format("mp3")
        .on("error", (err) => {
          console.log("ffmpeg error:", err);
          res.end();
        })
        .on("end", () => {
          res.end();
        })
        .pipe(res as unknown as NodeJS.WritableStream);
    } else {
      const stream = await yt.download(videoId, {
        type: "video+audio",
        quality: "best",
        format: "mp4",
        client: "IOS",
      });

      const nodeStream = Readable.fromWeb(stream as Parameters<typeof Readable.fromWeb>[0]);

      res.writeHead(200, { "Content-Type": "video/mp4" });
      nodeStream
        .pipe(res)
        .on("error", (err) => {
          console.log("pipe error:", err);
          res.end();
        });
    }
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
