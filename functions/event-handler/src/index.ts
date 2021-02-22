import { initializeConfig } from './config'
import { GlobalEventHandler } from './events'

export default async (req, res) => {
    await initializeConfig()
    console.log('[+] Received event:', req.body)
    new GlobalEventHandler(req.body)
    res.status(200)
    res.send({ success: true })
    res.end()
}
