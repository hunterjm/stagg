import { AppProps } from 'next/app';
import { Router } from 'next/router';
import { useState } from 'react';
import ReactNotification from 'react-notifications-component';
import { Header } from 'src/components/layout/Header';
import Loader from 'src/components/loader/Loader';
import { GlobalStyle } from 'src/styles/GlobalStyle';
import { theme } from 'src/styles/theme';
import { ThemeProvider } from 'styled-components';

import 'react-notifications-component/dist/theme.css';

const StaggWebUI = ({ Component, pageProps }: AppProps) => {
  // Loader Logic
  const [showLoader, setShowLoader] = useState(false);
  Router.events.on('routeChangeStart', (url) => {
    setShowLoader(true);
  });

  Router.events.on('routeChangeComplete', () => {
    setShowLoader(false);
  });
  Router.events.on('routeChangeError', () => {
    setShowLoader(false);
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Loader showLoader={showLoader} />
      <ReactNotification />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default StaggWebUI;
