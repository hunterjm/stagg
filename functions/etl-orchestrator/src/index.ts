import Axios from 'axios'
import { createConnection } from 'typeorm'
import { useConnection, initializeConfig, CONFIG } from './config'
import { Service } from './service'

let isConnected:boolean = false

const dbConnect = async () => {
    if (isConnected) return
    await createConnection(useConnection())
    isConnected = true
}

export default async (req, res) => {
    await initializeConfig()
    await dbConnect()
    console.log('[+] Connected, executing...')
    const service = new Service()
    const accounts = await service.getAccounts()
    for(const acct of accounts) {
        console.log('[+] Kicking off Account Data ETL for account_id', acct.account_id, '; last updated at', acct.updated_datetime)
        Axios.get(`${CONFIG.HOST_ETL_ACCOUNT}?account_id=${acct.account_id}`)
    }
    res.status(200)
    res.send({ success: true })
    res.end()
}
