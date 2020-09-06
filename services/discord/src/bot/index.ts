import * as Mongo from '@stagg/mdb'
import * as Discord from 'discord.js'
import logger from './logger'
import relay from './relay'
import cmds from './cmds'
import cfg from '../config'

let bot:Discord.Client
Mongo.config(cfg.mongo)

export const listen = async () => {
    bot = new Discord.Client()
    bot.login(cfg.discord.token)
    bot.on('ready', () => {
        console.log(`[+] Using bot ${bot.user.tag}`)
        bot.user.setActivity('for % messages...', {
            type: 'WATCHING',
            url: 'https://stagg.co/discord'
        })
    })
    bot.on('message', async (m:Discord.Message) => {
        if (m.author.id === bot.user.id) return // ignore any message from the bot itself
        const input = m.content.trim().replace(`<@!${bot.user.id}>`, '__BOT_TAG__') // clean + replace tag for regex
        if (m.channel.type !== 'dm' && !input.match(/^%/) && !input.match(/^__BOT_TAG__/)) return // ignore if not dm + no trigger
        // message is valid, create new log
        logger.create(m)
        // break message apart into commands and dispatch if possible
        const chain = input.replace(/^%\s*/, '').replace('__BOT_TAG__', '').replace(/\s+/, ' ').trim().split(' ')
        let dispatcher = cmds as any
        let lastDispatcherIndex = 0
        for(const i in chain) {
            const child = chain[i].toLowerCase()
            if (dispatcher[child]) {
                dispatcher = dispatcher[child]
                lastDispatcherIndex = Number(i)
                continue
            }
            const strippedChild = child.replace(/s$/i, '')
            if (dispatcher[strippedChild] || dispatcher['_default']) {
                lastDispatcherIndex = Number(i) - 1
                dispatcher = dispatcher[strippedChild] ? dispatcher[strippedChild] : dispatcher['_default']
            }
        }
        if (!dispatcher || typeof dispatcher !== 'function') {
            // check shortcuts here?
            relay(m, ['Invalid command, try `help`'])
            return // invalid cmd
        }
        dispatcher(m, ...chain.slice(lastDispatcherIndex+1))
    })
    bot.on('voiceStateUpdate', (oldState:Discord.VoiceState, newState:Discord.VoiceState) => {
        console.log(oldState.member.id)
        console.log(oldState.channelID)
        console.log(newState.channelID)
    })
}
