import Router from 'next/router'
import Cookies from 'js-cookie'
import { API } from 'src/api-services'

const DiscordOAuth = ({ jwt, forward }) => {
  try {
    window
  } catch(e) {
    return null
  }
  if (!jwt) {
    return null
  }
  Cookies.set('jwt.discord', jwt)
  Cookies.set('alert.oauth.discord', 'true')
  Router.push('/start')
  return null
}

DiscordOAuth.getInitialProps = async (ctx) => {
  const forward = ctx.query.state
  const { response } = await API.Discord.exchangeToken(ctx.query.code)
  return { jwt: response?.jwt, forward }
}
// eslint-disable-next-line import/no-default-export
export default DiscordOAuth
