import Head from 'next/head'
import JWT from 'jsonwebtoken'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Center from '../components/Center'
import Template from '../components/Template'
import { Wrapper, FormWrapper } from './login'
import cfg from '../config/ui'

// does not forward even though it gets jwt in res
export const Page = ({ user }) => {
  const [uno, setUno] = useState('')
  const recheck = async () => {
    const recheck = await fetch(`${cfg.api.host}/profile-status`, {
        method: 'POST',
        body: JSON.stringify({ email: user.email })
      })
    const { jwt, error } = await recheck.json()
    if (error) {
        return console.log('[!] Profile status:', error)
    }
    Cookies.set('jwt', jwt, { expires: 365 })
    const { profiles } = JWT.decode(jwt) as any
    setUno(profiles.uno)
  }
  const interval = setInterval(recheck, cfg.login.forward.recheck)
  useEffect(() => {
    if (uno) {
        clearInterval(interval)
        Router.push('/wz/[id]', `/wz/${uno.split('#').join('@')}`)
    }
  }, [uno])
  return (
    <Template user={user}>
      <Head>
        <title>Please wait while your profile is gathered...</title>
      </Head>
      <Wrapper>
        <Center>
          <FormWrapper>
              <Center>
                  <h2>Please wait while your profile is gathered...</h2>
              </Center>
          </FormWrapper>
          <p><small>This may take several minutes, you will be forwarded upon completion...</small></p>
        </Center>
      </Wrapper>
    </Template>
  )
}

export default Page
