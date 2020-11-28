import { useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { Layout } from 'src/components/layout'
import { Center } from 'src/components/sections/partials/Center'
import styled from 'styled-components'
import { API } from 'src/api-services'
import Router from 'next/router'
import { notify } from 'src/hooks/notify'
import * as store from 'src/store'
import * as JWT from 'jsonwebtoken'
import { getUser } from 'src/hooks/getUser'
import { profileUrlFromUserStateModel } from 'src/components/mw/hooks'

const Wrapper = styled.div`
  * {
    font-size: 0.8rem;
  }
  p {
    margin-top: 16px;
  }
  position: relative;
  z-index: 1;
  padding-top: 128px;
  text-align: center;
  margin-bottom: -30rem;
  .centered-container {
    flex-direction: column !important;
    flex-wrap: no-wrap !important;
    margin: auto !important;
  }
`

const FormWrapper = styled.div`
  border-radius: 0.5rem;
  box-shadow: 0px 0px 30px -15px #999999 inset;
  background-image: url('/cdn/callofduty/ui/cod.banner.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-color: rgba(0, 0, 0, 0.5);
  min-width: 560px;
  width: 60vw;
  max-width: 1440px;
  min-height: 500px;
  height: 20vw;
  img {
    display: block;
    margin: auto;
    width: 24rem;
    margin-bottom: 1rem;
  }
  font-family: 'Open Sans Condensed', Verdana, Arial, Helvetica, sans-serif;
  h2 {
    margin: 0;
    padding: 0;
    font-size: 22px;
    font-spacing: normal;
    font-weight: bold;
    font-style: normal;
    text-transform: uppercase;
    text-rendering: optimizeLegibility;
  }
  h2:first-of-type {
    margin-top: 32px;
  }
  h2:last-of-type {
    margin-top: -16px;
    margin-bottom: 16px;
  }
`

const InputWrapper = styled.div`
  * {
    color: white !important;
    border-color: white !important;
    width: 100%;
    text-align: left;
  }
  button {
    background-color: #0d121a;
    background-image: url('/cdn/callofduty/ui/dots.png');
    border: 1px solid #81898c;
    box-shadow: 0px 0px 30px -15px #999999 inset;
    transition: all 0.4s ease-in-out;
  }
  position: relative;
  margin: 0 auto;
  width: 24rem;
  text-align: center;

  .response {
    text-align: center;
    height: 0;
    line-height: 0;
    padding: 0;
    margin: 0;
    position: relative;
    bottom: -1.5rem;
  }

  .response.error {
    color: red !important;
  }
  .response.success,
  .response.success * {
    color: green !important;
  }
`

const Spacer = styled.div`
  height: 0.5rem;
`

const CallOfDutyLogin = () => {
  const userState = store.useState(store.userState)
  const userModel = userState.get()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [formResponse, setFormResponse] = useState(null)
  const submitLogin = async ():Promise<void> => {
    setFormResponse({})
    setBtnDisabled(true)
    const loginRes = await API.CallOfDuty.login(email, password)
    setFormResponse(loginRes)
    if (loginRes?.errors?.length || !loginRes?.response?.jwt) {
      setBtnDisabled(false)
      return
    }

    store.cookies.jwtCallOfDuty = loginRes.response.jwt
    const payload:any = JWT.decode(loginRes.response.jwt)
    if (payload.userId) {
      const { response } = await API.login('callofduty')
      if (response?.jwt) {
        store.cookies.jwtUser = response.jwt
        userState.set(getUser())
        notify({
          title: 'All clear for take off',
          message: 'You have been logged in',
          type: 'success',
          duration: 2500,
        })
        Router.push(profileUrlFromUserStateModel(userModel))
        return
      }
    }

    notify({
      title: 'Woohoo!',
      message: `Call of Duty account linked`,
      type: 'success',
      duration: 2500,
    })
    userState.set(getUser())
    Router.push('/start')
  }
  const ErrorMessage = () => {
    if (!formResponse?.errors?.length) {
      return <></>
    }
    return formResponse.errors.map(error => <p key={error} className="response error">{error}</p>)
  }
  return (
    <Layout hideSignIn title="Best-in-class stats, coaching, matchmaking, and more | Stagg.co">
      <Wrapper>
        <Center>
          <FormWrapper>
            <h2>JOIN THE WORLD OF</h2>
            <img src="/cdn/callofduty/ui/cod.png" alt="Call of Duty" />
            <h2>SIGN IN TO YOUR CALL OF DUTY ACCOUNT</h2>
            <InputWrapper>
              <TextField
                autoComplete="false"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Spacer />
              <TextField
                autoComplete="false"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Spacer />
              <Button
                disabled={btnDisabled}
                onClick={submitLogin}
                variant="contained"
                color="primary"
              >
                {btnDisabled ? 'Loading...' : 'Sign In'}
              </Button>
              <ErrorMessage />
            </InputWrapper>
          </FormWrapper>
          <p>
            <a
              href="https://profile.callofduty.com/cod/forgotPassword"
              target="_blank"
            >
              Trouble signing in?
            </a>
          </p>
        </Center>
      </Wrapper>
    </Layout>
  )
}

export default CallOfDutyLogin
