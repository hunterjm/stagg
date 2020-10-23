import { useState } from 'react'
import { Layout } from 'src/components/layout'
import { API } from 'src/api-services'

const Me = () => {
  const discordOauthUrl = 'https://discord.com/api/oauth2/authorize?client_id=738240182670589993&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fdiscord&response_type=code&scope=identify&state=some_jwt_hash_here'
  return (
    <Layout title="Well, this is embarassing...">
      <div style={{textAlign: 'center', paddingTop: '128px'}}>
        <h1>Well, this is embarassing...</h1>
        <h4>No fancy dashboards just yet, but you can link your Discord for the bot</h4>
        <h2><a href={discordOauthUrl}>Link Discord</a></h2>
      </div>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default Me
