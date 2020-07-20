import * as API from '@stagg/api'
import * as Mongo from '@stagg/mdb'
import * as mail from '@stagg/mail'
import * as Discord from 'discord.js'
import * as wz from './wz'
import relay from '../relay'
import { findPlayer } from './data'
import cfg from '../../config'

mail.config({
    jwtSecret: cfg.jwt,
    gmailUser: cfg.gmail.user,
    gmailPass: cfg.gmail.pass,
})

export { wz }

export const search = async (m:Discord.Message, ...args:string[]) => {
    const [username, platform] = args
    if (!username || username.length < 3) {
        relay(m, ['Enter at least 3 characters you lazy turd...'])
        return 
    }
    const msg = await relay(m, ['Finding player(s)...'])
    const db = await Mongo.client('callofduty')
    const queries = []
    if (platform) {
        queries.push({ [`profiles.${platform.toLowerCase()}`]: { $regex: username, $options: 'i' } })
    } else {
        for( const p of Object.keys(API.Map.CallOfDuty.Platforms) ) {
            queries.push({ [`profiles.${p}`]: { $regex: username, $options: 'i' } })
        }
    }
    const players = await db.collection('players').find({ $or: queries }).toArray()
    if (!players || !players.length) {
        msg.edit(['No results :('])
        return
    }
    const output = ['Results:', '```']
    for(const player of players) {
        const playerOutput = []
        for(const platform in player.profiles) {
            if (player.profiles[platform].toLowerCase().includes(username.toLowerCase())) {
                playerOutput.push(`${player.profiles[platform]} (${platform})`)
            }
        }
        output.push('', ...playerOutput)
    }
    msg.edit([...output, '```'])
}

export const register = async (m:Discord.Message, ...args:string[]) => {
    const db = await Mongo.client('callofduty')
    if (!args.length) {
        relay(m, ['Invalid request, missing identifier(s); must include email or username/platform'])
        return
    }
    const msg = await relay(m, ['Finding player...'])
    const isEmail = args[0].match(/[^@]+@[^\.]+\..+$/)
    const player = !isEmail
        ? await findPlayer({ username: args[0], platform: args[1] })
        : await db.collection('players').findOne({ email: args[0] })
    if (!player) {
        msg.edit([
            !isEmail
                ? 'Player record not found, try `search` or `help`'
                : "Email not found, are you sure you've logged in at https://stagg.co/login?"
        ])
        return
    }
    if (!player.email) {
        msg.edit(['Cannot link non-organic profiles; if this profile belongs to you sign in at https://stagg.co/login'])
        return
    }
    if (player.discord?.id) {
        if (player.discord?.id === m.author.id) {
            msg.edit(['Your Discord account is already linked'])
            return
        }
        msg.edit(['There is already a Discord account linked to this account, check your settings at https://stagg.co'])
        return
    }
    msg.edit(['Sending confirmation email...'])
    const sent = await mail.send.confirmation.discord(player.email, player.profiles.uno, { ...m.author })
    msg.edit([sent ? 'Confirmation email sent, check your inbox' : 'Failed to send confirmation email, please try again or contact support'])
}
