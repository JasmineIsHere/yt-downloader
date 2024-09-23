import type { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string' || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
    res.status(400).json({ error: 'Please provide a valid YouTube URL' });
    return;
  }

  try {
    const video = ytdl(url, { filter: 'audioonly' });
    const filePath = path.resolve('public', 'audio.mp3');
    const writeStream = fs.createWriteStream(filePath);

    video.pipe(writeStream);

    writeStream.on('finish', () => {
      res.status(200).json({ filePath: '/audio.mp3' });
    });

    writeStream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Error converting video' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error converting video' });
  }
}