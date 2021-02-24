import { validateNetworkAuth, useConfig } from '@stagg/gcp'
import { GlobalEventHandler } from './events'
import { config } from './config'

export default async (req, res) => {
    await useConfig(config)
    try { await validateNetworkAuth(req,res) } catch(e) { return }
    console.log(`[+] Received event "${req.body.type}"`)
    new GlobalEventHandler(req.body)
    res.status(200)
    res.send({ success: true })
    res.end()
}
