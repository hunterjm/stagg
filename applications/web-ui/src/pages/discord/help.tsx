import { DISCORD_JOIN_HELP_URL } from 'config/ui'

const Page = () => {
  try { window.location.href = DISCORD_JOIN_HELP_URL } catch(e) {}
  return null
}

Page.getInitialProps = ({ res }) => {
  if (res) {
    res.writeHead(302, { location: DISCORD_JOIN_HELP_URL })
    res.end()
  }
  return {}
}

// eslint-disable-next-line import/no-default-export
export default Page
