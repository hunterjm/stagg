import Router from 'next/router'
// import * as Cookies from 'cookies'
import Cookies from 'js-cookie'
import { API } from 'src/api-services'

const DiscordOAuth = ({ jwt }) => {
  try {
    window
  } catch(e) {
    return null
  }
  console.log(jwt)
  if (!jwt) {
    return null
  }
  Cookies.set('jwt.discord', jwt)
  Router.push('/me')
  return null
}

DiscordOAuth.getInitialProps = async (ctx) => {
  // const { req, res } = ctx
  // const cookies = new Cookies(req, res)
  const { status, response } = await API.Discord.exchangeToken(ctx.query.code)
  console.log(response)
  return { jwt: response?.jwt }
  // cookies.set('oauth.discord', JSON.stringify(response))
  // res.writeHead(302, { Location: '/me' })
  // res.end()
  // return {}
}
// eslint-disable-next-line import/no-default-export
export default DiscordOAuth
