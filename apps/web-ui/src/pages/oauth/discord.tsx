import Router from 'next/router'
import { API } from 'src/api-services'
import * as JWT from 'jsonwebtoken'
import * as store from 'src/store'
import { getUser } from 'src/hooks/getUser'
import { notify } from 'src/hooks/notify'
import { Layout } from 'src/components/layout'
import { useEffect } from 'react'
import { profileUrlFromUserStateModel } from 'src/components/mw/hooks'

const DiscordOAuth = ({ jwt, forward }) => {
  const userState = store.useState(store.userState)
  store.cookies.jwtDiscord = jwt
  const payload:any = JWT.decode(jwt)
  const userModel = userState.get()

  const attemptLogin = async () => { // Define separately for async
    const { response } = await API.login('discord')
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
    } else {
      Router.push('/start?')
    }
  }

  useEffect(() => { // useEffect so we only use Router on client
    if (payload?.userId) {
      attemptLogin()
      return
    }
    notify({
      title: 'Woohoo!',
      message: `Discord account linked`,
      type: 'success',
      duration: 2500,
    })
    userState.set(getUser())
    Router.push('/start')
  }, [])

  return (
    <Layout hideSignIn title="One moment...">
      <h2 style={{marginTop: 128, textAlign: 'center'}}>One moment...</h2>
    </Layout>
  )
}

DiscordOAuth.getInitialProps = async (ctx) => {
  let forward = ctx.query.state
  const res = await API.Discord.exchangeToken(ctx.query.code)
  return { jwt: res?.response?.jwt, forward }
}

// eslint-disable-next-line import/no-default-export
export default DiscordOAuth
