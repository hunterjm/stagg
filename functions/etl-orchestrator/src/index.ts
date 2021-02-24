import Axios from 'axios'
import { useConfig } from '@stagg/gcp'
import { createConnection } from 'typeorm'
import { useConnection, config } from './config'
import { Service } from './service'

let isConnected:boolean = false

const dbConnect = async () => {
    if (isConnected) return
    await createConnection(useConnection())
    isConnected = true
}

export default async (req, res) => {
    await useConfig(config)
    await dbConnect()
    console.log('[+] Connected, executing...')
    const service = new Service()
    const accounts = await service.getAccounts()
    for(const acct of accounts) {
        console.log('[+] Kicking off Account Data ETL for account_id', acct.account_id, '; last updated at', acct.updated_datetime)
        Axios.get(`${config.network.host.faas.etl.account}?account_id=${acct.account_id}`, { headers: { 'x-network-key': config.network.key } })
    }
    res.status(200)
    res.send({ success: true })
    res.end()
}
