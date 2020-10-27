import Head from 'next/head'
import React, { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

interface LayoutProps {
  title: string
  children: ReactNode
  hideSignIn?: boolean
}

export const Layout = ({ title, children, hideSignIn }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header navPosition="right" hideSignIn={hideSignIn} />
      <main className="site-content" style={{minHeight: 'calc(100vh - 100px)'}}>{children}</main>
      <Footer />
    </>
  )
}
