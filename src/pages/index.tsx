/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

const Home = () => {
  const [url, setUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  // const [filePath, setFilePath] = useState("");
  const [error, setError] = useState("");

  const getDetails = async (url: string) => {
    if (error) setError("");
    if (!url || (!url.includes("youtube.com/") && !url.includes("youtu.be/"))) {
      setError("Please enter a valid YouTube URL!");
      return;
    }
    try {
      const response = await fetch(`/api/convert?url=${url}`);
      const data = await response.json();
      if (response.ok) {
        setTitle(data.title);
        setThumbnail(data.thumbnail);
        setDownloadUrl(url);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Oops something went wrong, please try again later!");
    }
  };

  const download = async (type: string) => {
    if (error) setError("");
    try {
      // setFilePath("");
      const response = await fetch(
        `/api/download?url=${downloadUrl}&type=${type}`
      );
      if (response.ok) {
        console.log("response:", response);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        console.log("blob url:", url);
        const a = document.createElement("a");
        a.href = url;
        a.download = "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log("Download successful");
      } else {
        setError("Oops something went wrong with the download, please try again later!");
      }
    } catch (error) {
      console.log("error:", error);
      setError("Oops something went wrong, please try again later!");
    }
  };

  // useEffect(() => {
  //   if (filePath) {
  //     console.log(filePath);
  //     const a = document.createElement("a");
  //     a.href = filePath;
  //     a.download = filePath;
  //     a.click();
  //     setFilePath("");
  //   }
  // }, [filePath]);

  return (
    <div className="mt-[10%]">
      <div className="flex items-center justify-center flex-col my-auto gap-6">
        <h1 className="text-5xl font-semibold text-center">
          YouTube Downloader
        </h1>
        <input
          aria-label="YouTube url"
          className="rounded-2xl w-1/2 min-w-fit h-fit px-6 py-2"
          type="text"
          placeholder="Paste YouTube link here"
          onChange={(e) => setUrl(e.target.value)}
        />
        <div
          className="flex flex-col items-center justify-center"
          hidden={!title}
        >
          <h1 className="text-lg">{title}</h1>
          {thumbnail && (
            <img
              className="mt-2 shadow-md"
              src={thumbnail}
              alt="thumbnail"
              width={200}
              height={200}
            />
          )}
        </div>
        <button
          aria-label="convert"
          className="bg-[#FF0101] text-white rounded-2xl px-6 py-2 text-xl shadow-md"
          onClick={() => getDetails(url)}
        >
          Convert
        </button>
        <button
          aria-label="download"
          className="bg-white text-[#FF0101] rounded-2xl px-6 py-2 text-xl shadow-md disabled:hidden"
          disabled={!title}
          onClick={() => download("video")}
        >
          Download MP4
        </button>
        <button
          aria-label="download"
          className="bg-white text-[#FF0101] rounded-2xl px-6 py-2 text-xl shadow-md disabled:hidden"
          disabled={!title}
          onClick={() => download("audio")}
        >
          Download MP3
        </button>
        <div aria-label="error message" hidden={!error}>
          {error}
        </div>
      </div>
    </div>
  );
};

export default Home;
