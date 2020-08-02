import { AppProps } from 'next/app';
import React, { useEffect, useRef } from 'react';
import 'public/scss/style.scss';
import ScrollReveal, {
  ScrollRevealHandles,
} from 'src/components/elements/ScrollReveal';

function MyApp({ Component, pageProps }: AppProps) {
  const childRef = useRef<ScrollRevealHandles>();

  useEffect(() => {
    document.body.classList.add('is-loaded');
    childRef.current.init();

    // Add className "body-wrap" to the parent div
    document.querySelector('#__next').classList.add('body-wrap');
  }, []);

  return (
    <ScrollReveal
      ref={childRef}
      // eslint-disable-next-line react/no-children-prop
      children={() => <Component {...pageProps} />}
    />
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
