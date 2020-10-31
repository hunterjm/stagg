import Cookies from 'js-cookie'
import * as JWT from 'jsonwebtoken'
import { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import 'public/scss/style.scss'
import 'react-notifications-component/dist/theme.css'
import ReactNotification from 'react-notifications-component'


let ScrollReveal: scrollReveal.ScrollRevealObject;

if (typeof window !== 'undefined') {
  ScrollReveal = require('scrollreveal').default;
}

function StaggWebUI({ Component, pageProps }: AppProps) {
  const [jwt, updateJwt] = useState({})
  const setJwt = (jwt:string) => updateJwt(JWT.decode(jwt))
  useEffect(() => {
    ScrollReveal({ useDelay: 'onload' })
  }, [])

  return (
    <>
      <ReactNotification />
      <Component {...pageProps} />
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default StaggWebUI
