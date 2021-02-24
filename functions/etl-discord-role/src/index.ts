import { validateNetworkAuth, useConfig } from '@stagg/gcp'
import { runJob } from './worker'
import { config } from './config'

export default async (req, res) => {
    await useConfig(config)
    try { await validateNetworkAuth(req,res) } catch(e) { return }
    const { discord_id, limit, skip } = req.query as {[key:string]:string}
    await runJob(discord_id, limit, skip)
    res.status(200)
    res.send({ success: true })
    res.end()
}
