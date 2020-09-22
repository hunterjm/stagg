import Head from 'next/head';
import React, { ReactNode } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header navPosition="right" />
      <main className="site-content" style={{minHeight: 'calc(100vh - 100px)'}}>{children}</main>
      <Footer />
    </>
  );
};
