import Cookies from 'js-cookie'
import Router from 'next/router'
import { Layout } from 'src/components/layout'
import { API } from 'src/api-services'
import { AccountBoxes } from 'src/components/sections/Accounts'
import * as store from 'src/store'
import dynamic from 'next/dynamic'
import { getUser } from 'src/hooks/getUser'


const GettingStarted = () => {
  const userState = store.useState(store.userState)
  const userModel = userState.get()
  if (userModel.user?.userId) {
    Router.push(`/mw/@${userModel.user.userId}`)
  }
  const isFormReady = Boolean(userModel.oauth?.callofduty?.profiles?.length)
  const buttonDisabled = !isFormReady
  const completeSignUp = async () => {
    const { response } = await API.signup(Object.keys(userModel.oauth))
    if (response?.jwt) {
      store.cookies.jwtUser = response.jwt
      for(const domainId of Object.keys(userModel.oauth)) {
        Cookies.remove(`jwt.${domainId}`)
      }
      userState.set(getUser())
      Router.push(`/mw/@${userModel.user.userId}`)
    }
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
