import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import 'public/scss/style.scss';
import 'react-notifications-component/dist/theme.css'
import ReactNotification from 'react-notifications-component'


let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ScrollReveal({ useDelay: 'onload' });
  }, []);

  return (
    <>
      <ReactNotification />
      <Component {...pageProps} />
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
