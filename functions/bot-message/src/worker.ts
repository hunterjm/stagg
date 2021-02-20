import * as Discord from 'discord.js'
import { SECRETS } from './config'

let active = false
const client = new Discord.Client()

const connectDiscord = () => new Promise<void>((resolve) => {
    if (active) return resolve()
    client.login(SECRETS.DISCORD_CLIENT_TOKEN)
    client.on('ready', () => (active = true) && resolve())
})

export async function sendUserMessage(userId:string, message:Discord.APIMessageContentResolvable) {
    await connectDiscord()
    const user = await client.users.fetch(userId)
    await user.send(message)
}

export async function sendChannelMessage(channelId:string, message:Discord.APIMessageContentResolvable) {
    await connectDiscord()
    const channel = <Discord.TextChannel>client.channels.cache.get(channelId)
    await channel.send(message)
}
