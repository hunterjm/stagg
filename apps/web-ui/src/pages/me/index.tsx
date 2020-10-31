import Router from 'next/router'
import Cookies from 'js-cookie'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState, useEffect, useContext } from 'react'
import { Layout } from 'src/components/layout'
import { notify } from 'src/hooks/notify'
import { Context } from 'src/store'
import { AccountBoxes } from './Accounts'
import { API } from 'src/api-services'

const domainIdNames = {
  discord: 'Discord',
  callofduty: 'Call of Duty',
}

const Dashboard = () => {
  const store = useContext(Context)
  const [buttonDisabled, setButtonDisabled] = useState(true)
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
  useEffect(
    () => autorun(() => {
      setButtonDisabled(!store.loggedIn)
      for(const domainId of Object.keys(store.userState.oauth)) {
        if (store.userState.user?.userId) {
          loginAlert()
          return
        }
        if (store.userState.oauth[domainId]?.userId) {
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
    })
  )
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
export default observer(Dashboard)
