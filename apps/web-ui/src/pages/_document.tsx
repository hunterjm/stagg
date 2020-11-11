import Document, { Head, Main, NextScript } from 'next/document'

class AppDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="stylesheet" href="/cdn/core/style.css" media="all" />
          <link rel="stylesheet" href="/cdn/icomoon/style.css" media="all" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-171798332-1"
          />
          <script src="/cdn/core/ga.js" />
        </Head>
        <body className="has-animations" data-gr-c-s-loaded="true">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default AppDocument
