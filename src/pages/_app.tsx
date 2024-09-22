import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>YouTube to MP3 converter</title>
        <meta name="description" content="Convert YouTube videos to MP3 for free" />
        {/* <meta name="robots" content="index, nofollow" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
