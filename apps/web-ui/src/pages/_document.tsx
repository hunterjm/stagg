import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class AppDocument extends Document {
  public props:any
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="stylesheet" href="/cdn/core/style.css" media="all" />
          <link rel="stylesheet" href="/cdn/icomoon/style.css" media="all" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-171798332-1"
          />
          <script src="/cdn/core/ga.js" />
          {this.props.styleTags}
        </Head>
        <body className="has-animations" data-gr-c-s-loaded="true">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default AppDocument
