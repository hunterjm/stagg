import Cookies from 'js-cookie'
import Router from 'next/router'
import { Layout } from 'src/components/layout'
import { API } from 'src/api-services'
import { AccountBoxes } from 'src/components/sections/Accounts'
import * as store from 'src/store'
import dynamic from 'next/dynamic'
import { getUser } from 'src/hooks/getUser'
import { useState } from 'react'
import { profileUrlFromUserStateModel } from 'src/components/mw/hooks'


const GettingStarted = () => {
  const [loading, setLoading] = useState(false)
  const userState = store.useState(store.userState)
  const userModel = userState.get()
  if (userModel.user?.userId) {
    Router.push(profileUrlFromUserStateModel(userModel))
  }
  const isFormReady = Boolean(userModel.oauth?.callofduty?.profiles?.length)
  const buttonDisabled = !isFormReady || loading
  const completeSignUp = async () => {
    setLoading(true)
    const { response } = await API.signup(Object.keys(userModel.oauth))
    if (!response?.jwt) {
      setLoading(false)
      alert('Something went wrong')
      return
    }
    store.cookies.jwtUser = response.jwt
    userState.set(getUser())
    Router.push(profileUrlFromUserStateModel(userModel))
    userState.set(getUser())
  }
  return (
    <Layout title="Dashboard" hideSignIn>
      <div className="illustration-section-01" />
      <div style={{textAlign: 'center'}}>
        <h2>Getting Started</h2>
        <h5>Add at least one game account to continue</h5>
      </div>
      <div className="container" style={{textAlign: 'center'}}>
          <AccountBoxes />
          <p style={{marginTop: 64}}><small>Don't worry, you can always add more accounts later.</small></p>
          <button disabled={buttonDisabled} onClick={completeSignUp} className="button button-primary button-wide-mobile button-sm">
            Complete Registration
          </button>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default dynamic(() => Promise.resolve(GettingStarted), {
  ssr: false
})
