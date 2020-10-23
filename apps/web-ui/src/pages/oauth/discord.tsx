import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Layout } from 'src/components/layout'
import { API } from 'src/api-services'

const DiscordOAuth = () => {
  const router = useRouter()
  const tokenState = router.query.state as string
  const accessToken = router.query.code as string
  const [jwt, setJwt] = useState('')
  const exchangeToken = async () => {
    if (!accessToken) {
        return
    }
    const res = await API.Discord.exchangeToken(accessToken)
    if (res.status === 200) {
        window.location.href = '/me'
    }
  }
  useEffect(() => {
      exchangeToken()
  }, [router.query.code]) 
  return (
    <Layout title="Discord Simulator">
      <div style={{textAlign: 'center', paddingTop: '128px'}}>
        <h1>{ jwt ? 'Success' : 'One sec...' }</h1>
      </div>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default DiscordOAuth
