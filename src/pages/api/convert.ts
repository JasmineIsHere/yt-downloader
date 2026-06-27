import type { NextApiRequest, NextApiResponse } from "next";
import { ytdlp } from "@/utils/ytdlp";

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
    const info = await new Promise<{ title: string; thumbnail: string }>(
      (resolve, reject) => {
        const proc = ytdlp(url, ["--dump-single-json", "--no-warnings"]);
        let output = "";
        proc.stdout.on("data", (chunk) => (output += chunk));
        proc.stderr.on("data", (chunk) => console.error(chunk.toString()));
        proc.on("close", (code) => {
          if (code !== 0) return reject(new Error(`yt-dlp exited with code ${code}`));
          try {
            const json = JSON.parse(output);
            resolve({ title: json.title, thumbnail: json.thumbnail });
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    res.status(200).json(info);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching video info, please try again later" });
  }
}
