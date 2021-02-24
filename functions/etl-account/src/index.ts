import { validateNetworkAuth, useConfig } from '@stagg/gcp'
import { createConnection } from 'typeorm'
import * as Events from '@stagg/events'
import { useConnection, config } from './config'
import { DbService } from './service'
import { Worker } from './worker'

let isConnected:boolean = false

const dbConnect = async () => {
    if (isConnected) return
    await createConnection(useConnection())
    isConnected = true
}

export default async (req, res) => {
    await useConfig(config)
    try { await validateNetworkAuth(req,res) } catch(e) { return }
    const { fresh, account_id, redundancy, mw_end, cw_end, wz_end } = req.query as {[key:string]:string}
    if (!account_id) {
        res.status(400)
        res.send({ error: 'invalid account_id'})
        return
    }
    await dbConnect()
    const dbService = new DbService()
    const account = await dbService.getAccount(account_id)
    if (!account) {
        res.status(400)
        res.send({ error: 'invalid account_id'})
        return
    }
    console.log('[+] Connected, executing...')
    // set updated
    account.updated_datetime = new Date()
    await dbService.saveAccount(account)
    // kick-off worker
    const startTimes = { mw: Number(mw_end || 0), cw: Number(cw_end || 0), wz: Number(wz_end || 0) }
    const worker = new Worker(account, Boolean(redundancy || fresh), startTimes)
    await worker.Run()
    if (fresh) {
        await Events.Account.Ready.Trigger({ account })
    }
    res.status(200)
    res.send({ success: true })
    res.end()
}
