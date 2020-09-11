import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import 'public/scss/style.scss';

let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ScrollReveal({ useDelay: 'onload' });
  }, []);

  return <Component {...pageProps} />;
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
