import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

function JamesLand({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>james.land</title>
        <meta name="description" content="welcome to james.land" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default JamesLand;
