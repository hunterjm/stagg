import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { Layout } from 'src/components/layout'
import { getUser } from 'src/hooks/getUser'
import { notify } from 'src/hooks/notify'
import { AccountBoxes } from './Accounts'
import { API } from 'src/api-services'

const domainIdNames = {
  discord: 'Discord',
  callofduty: 'Call of Duty',
}

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [authJwt, setAuthJwt] = useState(null)
  const { accounts } = user || {}
  const triggerLogin = async () => {
    const { response } = await API.login(authJwt)
    if ( response?.jwt ) {
      Cookies.set('jwt.user', response.jwt)
      notify({
        title: 'All clear for take off',
        message: 'You have been logged in',
        type: 'success',
        duration: 1500,
      })
    }
  }
  useEffect(() => {
    if (!user) {
      setUser(getUser())
      return
    }
    for(const domainId of Object.keys(accounts)) {
      if (accounts[domainId]?.userId) {
        setReady(true)
        setAuthJwt(Cookies.get(`jwt.${domainId}`))
      }
      if (Cookies.get(`alert.oauth.${domainId}`)) {
        notify({
          title: 'Woohoo!',
          message: `${domainIdNames[domainId]} account linked`,
          type: 'success',
          duration: 1500,
        })
        Cookies.remove(`alert.oauth.${domainId}`)
      }
    }
    if (!ready && accounts?.callofduty) {
      setReady(true)
    }
  }, [user])
  useEffect(() => {
    if (!authJwt || Cookies.get('jwt.user')) {
      return
    }
    triggerLogin()
  }, [authJwt])
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
          <button disabled={!ready} className="button button-primary button-wide-mobile button-sm">Complete Registration</button>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default Dashboard
