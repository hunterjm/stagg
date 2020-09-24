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
        <input type="text" onChange={e => setInput(e.target.value)} /> <button onClick={runCmd}>run</button>
        <pre style={{textAlign: 'left'}}>
          {
            output.map(line => <p>{line}</p>)
          }
        </pre>
      </div>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default BlizzardOAuth
