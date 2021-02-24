import { config } from 'config/ui'

const Page = () => {
  console.log('Forwarding to:', config.network.host.discord.invite.welcome)
  try { window.location.href = config.network.host.discord.invite.welcome } catch(e) {}
  return null
}

Page.getInitialProps = ({ res }) => {
  console.log('Forwarding to:', config.network.host.discord.invite.welcome)
  if (res) {
    res.writeHead(302, { location: config.network.host.discord.invite.welcome })
    res.end()
  }
  return {}
}

// eslint-disable-next-line import/no-default-export
export default Page
