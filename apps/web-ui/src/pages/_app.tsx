import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import 'public/scss/style.scss';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList.add('is-loaded');

    // Add className "body-wrap" to the parent div
    document.querySelector('#__next').classList.add('body-wrap');
  }, []);

  return <Component {...pageProps} />;
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
