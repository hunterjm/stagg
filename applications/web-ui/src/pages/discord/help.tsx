import { config } from 'config/ui'

const Page = () => {
  try { window.location.href = config.network.host.discord.invite.help } catch(e) {}
  return null
}

Page.getInitialProps = ({ res }) => {
  if (res) {
    res.writeHead(302, { location: config.network.host.discord.invite.help })
    res.end()
  }
  return {}
}

// eslint-disable-next-line import/no-default-export
export default Page
