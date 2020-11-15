import Head from 'next/head'
import { useEffect } from 'react'
import { AppProps } from 'next/app'
import 'public/scss/style.scss'
import 'react-notifications-component/dist/theme.css'
import ReactNotification from 'react-notifications-component'


let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

const StaggWebUI = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    ScrollReveal({ useDelay: 'onload' })
  }, [])

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/cdn/core/style.css" media="all" />
        <link rel="stylesheet" href="/cdn/icomoon/style.css" media="all" />
        <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-171798332-1"
          />
        <script src="/cdn/core/ga.js" />
      </Head>
      <ReactNotification />
      <Component {...pageProps} />
    </>
  )
}


// eslint-disable-next-line import/no-default-export
export default StaggWebUI
