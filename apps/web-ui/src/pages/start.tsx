import Cookies from 'js-cookie'
import Router from 'next/router'
import { Layout } from 'src/components/layout'
import { notify } from 'src/hooks/notify'
import { API } from 'src/api-services'
import { AccountBoxes } from 'src/components/sections/Accounts'
import * as store from 'src/store'
import dynamic from 'next/dynamic'

const domainIdNames = {
  discord: 'Discord',
  callofduty: 'Call of Duty',
}

const GettingStarted = () => {
  const userState = store.useState(store.userState).get()
  const isLoggedIn = Boolean(userState.user?.userId)
  const isFormReady = Boolean(userState.oauth?.callofduty?.profiles?.length)
  const buttonDisabled = !isFormReady
  const triggerLogin = async (domainId:string) => {
    const { response } = await API.login(domainId)
    if ( response?.jwt ) {
      Cookies.set('jwt.user', response.jwt)
      loginAlert()
    }
  }
  const loginAlert = () => {
    notify({
      title: 'All clear for take off',
      message: 'You have been logged in',
      type: 'success',
      duration: 2500,
    })
  }
  const checkForAuth = () => {
    for(const domainId of Object.keys(userState.oauth)) {
      if (isLoggedIn) {
        loginAlert()
        // Router.push('/me')
        return
      }
      if (userState.oauth[domainId]?.userId) {
        triggerLogin(domainId)
        return
      }
      if (Cookies.get(`alert.oauth.${domainId}`)) {
        notify({
          title: 'Woohoo!',
          message: `${domainIdNames[domainId]} account linked`,
          type: 'success',
          duration: 2500,
        })
        Cookies.remove(`alert.oauth.${domainId}`)
      }
    }
  }
  if (userState.oauth) {
    checkForAuth()
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
          <button disabled={buttonDisabled} className="button button-primary button-wide-mobile button-sm">Complete Registration</button>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default dynamic(() => Promise.resolve(GettingStarted), {
  ssr: false
})
