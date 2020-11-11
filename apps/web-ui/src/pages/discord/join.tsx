import cfg from 'config/ui'

const JoinDiscordServer = () => {
  return <></>
}

JoinDiscordServer.getInitialProps = ({ res }) => {
  if (res) {
    res.writeHead(302, { location: cfg.discord.url.join })
    res.end()
  }
  return {}
}

// eslint-disable-next-line import/no-default-export
export default JoinDiscordServer
