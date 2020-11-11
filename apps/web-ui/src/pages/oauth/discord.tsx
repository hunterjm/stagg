import Router from 'next/router'
import { API } from 'src/api-services'
import * as JWT from 'jsonwebtoken'
import * as store from 'src/store'
import { getUser } from 'src/hooks/getUser'
import { notify } from 'src/hooks/notify'
import { useEffect } from 'react'

const DiscordOAuth = ({ jwt, forward }) => {
  try {
    window
  } catch(e) {
    return null
  }
  if (!jwt) {
    return null
  }

  const userState = store.useState(store.userState)

  useEffect(() => {
    store.cookies.jwtDiscord = jwt
    const payload:any = JWT.decode(jwt)
  
    const attemptLogin = async () => {
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
        Router.push(`/mw/@${payload.userId}`)
      } else {
        Router.push('/start?')
      }
    }
  
    if (!payload?.userId) {
      notify({
        title: 'Woohoo!',
        message: `Discord account linked`,
        type: 'success',
        duration: 2500,
      })
      userState.set(getUser())
      Router.push('/start')
      return
    }
  
    attemptLogin()
  })

  return null
}

DiscordOAuth.getInitialProps = async (ctx) => {
  let forward = ctx.query.state
  const { response } = await API.Discord.exchangeToken(ctx.query.code)
  return { jwt: response?.jwt, forward }
}
// eslint-disable-next-line import/no-default-export
export default DiscordOAuth
