import Head from 'next/head'
import JWT from 'jsonwebtoken'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button } from '@material-ui/core'
import Center from '../components/Center'
import Template from '../components/Template'
import cfg from '../config/ui'

export const Wrapper = styled.div`
  height: 80vh;
  margin-bottom: -30rem;
  .centered-container {
    flex-direction: column !important;
    flex-wrap: no-wrap !important;
    margin: auto !important;
  }
`

export const FormWrapper = styled.div`
    border-radius: 0.5rem;
    box-shadow: 0px 0px 30px -15px #999999 inset;
    background-image: url('/assets/img/cod.banner.png');
    background-repeat:no-repeat;
    background-position: center center;
    background-color: rgba(0, 0, 0, 0.5);
    min-width: 560px;
    width: 60vw;
    max-width: 1440px;
    min-height: 500px;
    height: 20vw;
    img {
        width: 24rem;
        margin-bottom: 1rem;
    }
    font-family: "Open Sans Condensed", Verdana, Arial, Helvetica, sans-serif;
    h2 {
        font-size: 22px;
        font-spacing: normal;
        font-weight: bold;
        font-style: normal;
        text-transform: uppercase;
        text-rendering: optimizeLegibility;
    }
`

export const InputWrapper = styled.div`
    * {
        color: white !important;
        border-color: white !important;
        width: 100%;
        text-align: left;
    }
    button {
        background-color: #0d121a;
        background-image: url('/assets/img/dots.png'); border: 1px solid #81898c;
        box-shadow: 0px 0px 30px -15px #999999 inset;
        transition: all 0.4s ease-in-out;
    }
    position: relative;
    margin: 0 auto;
    width: 24rem;
    text-align: center;

    .response {
      text-align: center;
      color: red !important;
      height: 0;
      line-height: 0;
      padding: 0;
      margin: 0;
      position: relative;
      bottom: -1.5rem;
    }

    .response a {
      color: red !important;
    }
    .response.success, .response.success * {
      color: green !important;
    }
`

export const Spacer = styled.div`
    height: 0.5rem;
`

enum Status { Idle, Loading, Success, Error }
export default ({ user }) => {
  if (user) try { Router.push('/wz/[id]', `/wz/${user.profiles.uno.split('#').join('@')}`) } catch(e) {}
  const [form, setForm] = useState({ status: Status.Idle, input: { email: '', password: '' }, response: '' })
  const buttonDisabled = form.status === Status.Loading || form.status === Status.Success
  const setEmail = (email:string) => setForm({ ...form, input: { ...form.input, email } })
  const setPassword = (password:string) => setForm({ ...form, input: { ...form.input, password } })
  const formErr = (err:string) => {
    const newForm = {...form}
    newForm.response = err
    newForm.status = Status.Error
    setForm(newForm)
  }
  const submitForm = async () => {
    setForm({ ...form, status: Status.Loading })
    if (!form.input.email) return formErr('email required')
    if (!form.input.email.match(/^[^@]+@[^\.]+\..+$/)) return formErr('invalid email')
    if (!form.input.password) return formErr('password required')
    const login = await fetch(`${cfg.api.host}/login`, {
      method: 'POST',
      body: JSON.stringify(form.input)
    })
    const { jwt, error } = await login.json()
    if (error) {
      setForm({ ...form, status: Status.Idle })
      return formErr(error)
    }
    Cookies.set('jwt', jwt, { expires: 365 })
    const decodedJwt = JWT.decode(jwt) as any
    const forward = { page: '/first-sign-in', as: '/first-sign-in' }
    if (decodedJwt?.profiles?.uno) {
      const { profiles: { uno } } = decodedJwt
      forward.page = '/wz/[id]'
      forward.as = `/wz/${uno.split('#').join('@')}`
    }
    setForm({ ...form, status: Status.Success, response: 'login successful, one moment...'})
    setTimeout(() => Router.push(forward.page, forward.as), cfg.login.forward.delay)
  }
  return (
    <Template user={user}>
      <Head>
        <title>Sign in to your Call of Duty account</title>
      </Head>
      <Wrapper>
        <Center>
          <FormWrapper>
              <Center>
                  <h2>JOIN THE WORLD OF</h2>
                  <img src="/assets/img/cod.png" alt="Call of Duty" />
                  <h2>SIGN IN TO YOUR CALL OF DUTY ACCOUNT</h2>
                  <InputWrapper>
                      <TextField autoComplete={'false'} label="Email" variant="outlined" onChange={e => setEmail(e.target.value)} />
                      <Spacer />
                      <TextField autoComplete={'false'} label="Password" type="password" variant="outlined" onChange={e => setPassword(e.target.value)} />
                      <Spacer />
                      <Button disabled={buttonDisabled} onClick={submitForm} variant="contained" color="primary">{ buttonDisabled ? 'Loading...' : 'Sign In' }</Button>
                      <p className={['response', form.status === Status.Success ? 'success' : ''].join(' ')}>{form.response}</p>
                  </InputWrapper>
              </Center>
          </FormWrapper>
          <p><a href="https://profile.callofduty.com/cod/forgotPassword" target="_blank">Trouble signing in?</a></p>
        </Center>
      </Wrapper>
    </Template>
  )
}
