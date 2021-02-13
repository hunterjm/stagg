import Head from 'next/head'
import React, { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

interface LayoutProps {
  title: string
  children: ReactNode
  hideSignIn?: boolean
  hideHelp?: boolean
  simpleSignIn?: boolean
}

export const Layout = ({ title, children, hideSignIn, simpleSignIn, hideHelp }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header navPosition="right" hideSignIn={hideSignIn} simpleSignIn={simpleSignIn} hideHelp={hideHelp} />
      <main className="site-content" style={{minHeight: 'calc(100vh - 100px)'}}>{children}</main>
      <Footer />
    </>
  )
}
