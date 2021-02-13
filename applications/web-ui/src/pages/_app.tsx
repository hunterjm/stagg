import { AppContext, AppProps } from 'next/app'
import { reduxWrapper } from 'src/redux/store'
import { getActionsFromState, getStateFromRawCookieHeader } from 'src/redux/cookie'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

interface PageProps extends AppProps {
  renderReport?: boolean
}
const Page = ({ Component, pageProps, renderReport }: PageProps) => {
  return (
    <>
      <ReactNotification />
      <Component {...pageProps} renderReport={renderReport} />
    </>
  )
}

Page.getInitialProps = async ({ Component, ctx }:AppContext) => {
  if (ctx?.req?.headers?.cookie) {
    const state = getStateFromRawCookieHeader(ctx.req.headers.cookie)
    const actions = getActionsFromState(state)
    for(const { type, payload } of actions) {
      ctx.store.dispatch({ type, payload })
    }
  }
  const pageProps = !Component.getInitialProps ? {} : await Component.getInitialProps(ctx)
  const renderReport = Boolean(ctx?.req?.headers['x-render-report'] || ctx?.query?.report !== undefined)
  return {
    pageProps,
    renderReport,
  }
}

// eslint-disable-next-line import/no-default-export
export default reduxWrapper.withRedux(Page)
