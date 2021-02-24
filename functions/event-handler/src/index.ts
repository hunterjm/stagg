import { validateNetworkAuth } from '@stagg/gcp'
import { GlobalEventHandler } from './events'

export default async (req, res) => {
    try { await validateNetworkAuth(req,res) } catch(e) { return }
    console.log(`[+] Received event "${req.body.type}"`)
    new GlobalEventHandler(req.body)
    res.status(200)
    res.send({ success: true })
    res.end()
}
