import { initializeConfig } from './config'
import { format, sendUserMessage, sendChannelMessage } from './worker'

export default async (req, res) => {
    let { user, channel, payload } = req.body as {[key:string]:string}
    await initializeConfig()
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
