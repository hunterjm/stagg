import axios from 'axios'
import { delay } from '@stagg/util'

const maxExecutions  = 20
const maxExecutionMS = 59000
const time = () => new Date().getUTCMilliseconds()
const startTimeMS = time()
export default async (req, res) => {
    for(let i = 0; i < maxExecutions; i++) {
        if (time() >= startTimeMS + maxExecutionMS) {
            break
        }
        await axios('https://us-east1-stagcp.cloudfunctions.net/scrape-cod-worker')
        await delay(100)
    }
    res.status(200).send({ success: true })
}