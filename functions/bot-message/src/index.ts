import { initializeConfig } from './config'
import { sendUserMessage, sendChannelMessage } from './worker'

export default async (req, res) => {
    const { user, channel, payload } = req.body as {[key:string]:string}
    await initializeConfig()
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
