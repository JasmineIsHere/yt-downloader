# yt-downloader

A Next.js web app for downloading YouTube videos as MP4 or MP3. Users paste a YouTube URL, preview the video title and thumbnail, then trigger a download.

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **YouTube fetching:** @distube/ytdl-core
- **Audio conversion:** fluent-ffmpeg + @ffmpeg-installer/ffmpeg
- **Deployment:** Vercel

## File Structure

```
yt-downloader/
├── src/
│   ├── pages/
│   │   ├── index.tsx          # Main UI — URL input, convert button, MP4/MP3 download buttons
│   │   ├── _app.tsx           # App wrapper with global styles
│   │   ├── _document.tsx      # Custom HTML document
│   │   └── api/
│   │       ├── convert.ts     # GET /api/convert?url= — fetches video title & thumbnail
│   │       └── download.ts    # POST /api/download?url=&type= — streams MP4 or MP3 to client
│   ├── styles/                # Global CSS
│   └── utils/
│       └── jsonParser.ts      # Utility for safe JSON parsing
├── public/                    # Static assets
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## How It Works

1. User pastes a YouTube URL into the input and clicks **Convert**.
2. Frontend calls `GET /api/convert?url=<url>` — server uses ytdl-core to fetch video info (title, thumbnail) and returns it as JSON.
3. User clicks **Download MP4** or **Download MP3**.
4. Frontend calls `POST /api/download?url=<url>&type=video|audio`.
   - `video`: streams the highest-quality MP4 directly via ytdl-core.
   - `audio`: uses ytdl-core to get the audio stream, then pipes it through fluent-ffmpeg to convert to MP3 before streaming to the client.
5. The browser receives the blob and triggers a file download.

## Development

```bash
npm install
npm run dev      # starts at http://localhost:3000
```

## Build & Deploy

```bash
npm run build    # Next.js production build
npm run start    # Serve production build locally
```

Deployed on Vercel — push to main triggers a deploy automatically.

## No Tests

There is no test suite. Manual testing via the browser UI.

## Notes

- Downloading copyrighted content may violate YouTube's ToS — intended for personal use only.
- The `next.config.mjs` may need updates if ytdl-core changes its internal module structure.
