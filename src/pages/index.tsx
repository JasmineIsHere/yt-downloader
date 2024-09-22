import { useState } from "react";

const Home = () => {
  const [url, setUrl] = useState("");
  const [downloadFile, setDownloadFile] = useState("");
  const [error, setError] = useState("");

  const convertToMP3 = (url: string) => {
    if (error) setError("");
    if (!url || (!url.includes("youtube.com/") && !url.includes("youtu.be/"))) {
      setError("Please enter a valid YouTube URL!");
      return;
    }
    // TODO: implement the conversion logic
    setDownloadFile("video.mp3");
  };

  const downloadMP3 = (downloadFile: string) => {
    // TODO: implement the download logic
    if (!downloadFile) return;
  };

  return (
    <div className="mt-[10%]">
      <div className="flex items-center justify-center flex-col my-auto gap-6">
        <h1 className="text-5xl font-semibold text-center">
          YouTube to MP3 converter
        </h1>
        <input
          aria-label="YouTube url"
          className="rounded-2xl w-1/2 min-w-fit h-fit px-6 py-2"
          type="text"
          placeholder="Paste YouTube link here"
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          aria-label="convert"
          className="bg-[#FF0101] text-white rounded-2xl px-6 py-2 text-xl shadow-md"
          onClick={() => convertToMP3(url)}
        >
          Convert
        </button>
        <button
          aria-label="download"
          className="bg-white text-[#FF0101] rounded-2xl px-6 py-2 text-xl shadow-md disabled:hidden"
          disabled={!downloadFile}
          onClick={() => downloadMP3(downloadFile)}
        >
          Download
        </button>
        <div aria-label="error message" hidden={!error}>
          {error}
        </div>
      </div>
    </div>
  );
};

export default Home;