import { useState } from 'react'
import { Layout } from 'src/components/layout'
import { API } from 'src/api-services'

const BlizzardOAuth = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState([])
  const runCmd = async () => setOutput(await API.Discord.simCommand(...input.split(' ')))
  return (
    <Layout title="Discord Simulator">
      <div style={{textAlign: 'center', paddingTop: '128px'}}>
        <h1>yo</h1>
      </div>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default BlizzardOAuth
