import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class AppDocument extends Document {
  public props:any
  static getInitialProps(ctx) {
    const renderReport = Boolean(ctx?.req?.headers['x-render-report'] || ctx?.query?.report !== undefined)
    const sheet = new ServerStyleSheet()
    const page = ctx.renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags, renderReport }
  }
  render() {
    return this.props.renderReport ? this.renderReport() : this.renderApp()
  }
  renderApp() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="author" content="Stagg.co" />
          <meta name="description" content="Call of Duty Discord Bot Companion" />
          <link rel='shortcut icon' type='image/x-icon' href='/assets/images/favicon.ico' />
          <link rel="stylesheet" href="/assets/css/theme.css" media="all" />
          <link rel="stylesheet" href="/assets/css/utilities.css" media="all" />
          <link rel="stylesheet" href="/assets/icomoon/style.css" media="all" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-171798332-1"></script>
          <script async src="/assets/js/ga.js"></script>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
  renderReport() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Static Report - Stagg.co</title>
          <meta name="author" content="Stagg.co" />
          <meta name="description" content="Call of Duty Discord Bot Companion" />
          <link rel='shortcut icon' type='image/x-icon' href='/assets/images/favicon.ico' />
          <link rel="stylesheet" href="/assets/css/report.css" media="all" />
          <link rel="stylesheet" href="/assets/css/utilities.css" media="all" />
          <link rel="stylesheet" href="/assets/icomoon/style.css" media="all" />
          {this.props.styleTags}
        </head>
        <body>
          <Main />
        </body>
      </html>
    )
  }
}

// eslint-disable-next-line import/no-default-export
export default AppDocument
