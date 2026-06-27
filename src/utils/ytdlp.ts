import { spawn } from "child_process";
import path from "path";

// Looks for yt-dlp in the project root, then falls back to PATH
const YTDLP_BINARY =
  process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";

export const YTDLP_PATH = path.join(process.cwd(), YTDLP_BINARY);

export function ytdlp(url: string, args: string[]) {
  return spawn(YTDLP_PATH, [url, ...args], { stdio: ["ignore", "pipe", "pipe"] });
}
