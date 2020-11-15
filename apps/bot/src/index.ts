import axios from 'axios'
import * as cors from 'cors'
import * as express from 'express'
import * as Discord from 'discord.js'
import * as mdb from './mongodb'
import { formatOutput as fmt } from './format'
import cfg from './config'

let client:Discord.Client
const app = express()
app.use(cors({ credentials: false })).listen(cfg.port, async () => {
    const db = await mdb.config(cfg.mongo).client('discord')
    client = new Discord.Client()
    client.login(cfg.discord.token)
    client.on('ready', () => {
        console.log(`[+] Using bot ${client.user.tag}`)
        client.user.setActivity(`for % in ${client.guilds.cache.array().length} servers`, {
          type: 'WATCHING',
          url: 'https://stagg.co'
        })
        console.log(
            `${'\x1b[32m' /* green */}${'\x1b[1m' /* bright/bold */}`+
            `----------------------------------------------------------\n`+
            `| Discord bot online: ${client.user.tag}\n`+
            `----------------------------------------------------------${'\x1b[0m' /* reset */}`
        )
    })
    client.on('message', async (m:Discord.Message) => {
        if (m.author.bot) {
            return // ignore bot messages
        }
        if (m.author.id === client.user.id) {
            return // ignore any message from the bot itself
        }
        const input = m.content.trim().replace(`<@!${client.user.id}>`, '__BOT_TAG__') // clean + replace tag for regex
        if (m.channel.type !== 'dm' && !input.match(/^%/) && !input.match(/^__BOT_TAG__/)) {
            return // ignore if not dm + no trigger
        }
        // attempt insert, if it succeeds we are the first instance to respond and may proceed, otherwise exit
        try {
            await db.collection('bot.logs').insertOne({ _id: m.id })
        } catch(e) {
            return // already caught by another instance, exit...
        }
        const initialReply = await m.channel.send(fmt(['One moment...']))
        const chain = m.content
            .replace(/^%\s*/, '') // remove % prefix and any following space
            .split(`<@!${client.user.id}>\s*`).join('') // remove bot tags and any following space
            .replace(/\s+/g, ' ') // replace multiple spaces with single space
            .trim() // trim space from ends
            .split(' ') // split into array of words
    })
    app.get('/', (req,res) => res.redirect('https://stagg.co/discord'))
    app.get('/health', (req,res) => res.status(200).send('ok'))
})