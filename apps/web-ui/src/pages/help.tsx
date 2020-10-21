import { useState } from 'react'
import { Layout } from 'src/components/layout'
import { API } from 'src/api-services'

const DiscordSimulator = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState([])
  const runCmd = async () => setOutput(await API.Discord.simCommand(...input.split(' ')))
  return (
    <Layout title="Stagg.co | Help Guides and Documentation">
      <div style={{textAlign: 'center', paddingTop: '128px'}}>
        <h3>Help docs coming soon!</h3>
      </div>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default DiscordSimulator
