import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { Layout } from 'src/components/layout'
import { getUser } from 'src/hooks/getUser'
import { notify } from 'src/hooks/notify'
import { AccountBoxes } from './Accounts'

const domainIdNames = {
  discord: 'Discord',
  callofduty: 'Call of Duty',
}

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const { accounts } = user || {}
  const triggerLogin = async (domainId:string) => {

  }
  useEffect(() => {
    if (!user) {
      setUser(getUser())
      return
    }
    for(const domainId of Object.keys(accounts)) {
      if (accounts[domainId].userId) {
        setReady(true)
        triggerLogin(domainId)
        setUserId(accounts[domainId].userId)
        notify({
          title: 'One moment',
          message: 'Logging you into your account...',
          type: 'info',
          duration: 0,
        })
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
