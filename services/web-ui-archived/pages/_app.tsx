import cookie from 'cookie'
import App, { AppProps } from 'next/app'
import cfg from '../config/ui'
const PageRender = ({ Component, pageProps }:AppProps) => {
    return (
        <Component {...pageProps} />
    )
}
PageRender.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext)
    const { host } = cfg.api
    const inheritedProps = { ...appProps, pageProps: { ...appProps.pageProps } }
    let cookieStr = ''
    try { cookieStr = document?.cookie } catch (e) {}
    if (appContext.ctx?.req?.headers?.cookie) cookieStr = appContext.ctx.req.headers.cookie
    const cookies = cookie.parse(cookieStr)
    if (cookies.jwt) {
        const jwtRes = await fetch(`${host}/jwt?t=${cookies.jwt}`)
        const jwtJson = await jwtRes.json()
        inheritedProps.pageProps.user = jwtJson
        try {
            const discordProfileRes = await fetch(`${host}/discord/profile?email=${jwtJson.email}`)
            const discordProfileJson = await discordProfileRes.json()
            inheritedProps.pageProps.user.discord = discordProfileJson
        } catch(e) { /* no discord in db for this player */ }
    }
    if (cookies['filters']) {
        inheritedProps.pageProps.filters = JSON.parse(cookies['filters'])
    }
    return inheritedProps
}
export default PageRender
