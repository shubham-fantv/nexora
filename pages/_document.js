import Document, { Html, Head, Main, NextScript } from "next/document";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
