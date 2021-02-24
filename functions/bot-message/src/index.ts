import { validateNetworkAuth, useConfig } from '@stagg/gcp'
import { format, sendUserMessage, sendChannelMessage } from './worker'
import { config } from './config'

export default async (req,res) => {
    await useConfig(config)
    let { user, channel, payload } = req.body as {[key:string]:string}
    try { await validateNetworkAuth(req,res) } catch(e) { return }
    if (Array.isArray(payload)) {
        payload = format(payload)
    }
    if (user) {
        await sendUserMessage(user, payload)
    }
    if (channel) {
        await sendChannelMessage(channel, payload)
    }
    res.status(200)
    res.send({ success: true })
    res.end()
}
