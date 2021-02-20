import { CONFIG } from 'src/config'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class AutoLFG implements Feature {
    public namespace:string = 'lfg'
    public async onMessage(handler:MessageHandler):Promise<void> {
        handler.reply(['You have been tagged in the <#channel_id> channel'])
    }
}




// let active = false
// const client = new Discord.Client()

// const connectDiscord = () => new Promise<void>((resolve) => {
//     if (active) return resolve()
//     client.login(SECRETS.DISCORD_CLIENT_TOKEN)
//     client.on('ready', () => (active = true) && resolve())
// })

// const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))

// export async function runJob() {
//     await connectDiscord()
//     const guild = await client.guilds.fetch('729780289727102976')
//     const botUser = await guild.members.fetch('738240182670589993')
//     const botRole = botUser.roles.cache.find(({ name }) => name.toLowerCase().includes('stagg'))
//     console.log(botRole)
//     const everyoneRoleId = guild.roles.cache.find(({ name }) => name === '@everyone')
//     const createdChannel = await guild.channels.create('「👀」lfg-readme', {
//         type: 'text',
//         parent: '729783770898628648',
//         reason: `LFG Voice Channel Highlight`,
//         position: 10,
//         permissionOverwrites: [
//             {
//                 id: everyoneRoleId,
//                 deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
//             },
//             {
//                 id: botRole.id,
//                 allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
//             },
//             {
//                 id: '318726630971408384',
//                 type: 'member',
//                 allow: ['VIEW_CHANNEL'],
//             },
//         ],
//     })
//     await createdChannel.send([
//         '```',
//         'You have been assigned to voice channel:',
//         '```',
//         '**「🔐」private**',
//         '',
//         '```',
//         'This private channel will auto-delete in 30s...',
//         '```',
//     ].map(s => `> ${s}`).join('\n'))
//     await delay(15000)
//     await createdChannel.delete()
// }

// import * as Discord from 'discord.js'
// import * as shortHash from 'short-hash'
// import relay, { formatOutput } from '../relay'

// export default async (m:Discord.Message) => {
//     await newSquad(m)
// }

// const newSquad = async (m:Discord.Message) => {
//     const userSuppliedCatId = '805509745389207632'
//     const { id: everyoneRoleId } = m.guild.roles.cache.find(({ name }) => name === '@everyone')
//     const TKN = shortHash(`${new Date().getUTCMilliseconds()} - ${Math.random()}`).toUpperCase()
//     const squadRole = await m.guild.roles.create({
//         data: {
//             name: `Stagg LFG Squad ${TKN}`,
//         },
//         reason: `LFG New Squad ${TKN}`
//     })-

//     const squadVoice = await m.guild.channels.create('🔐-squad-voice', {
//         type: 'voice',
//         parent: userSuppliedCatId,
//         reason: `LFG New Squad ${TKN}`,
//         permissionOverwrites: [
//             {
//                 id: everyoneRoleId,
//                 deny: ['VIEW_CHANNEL', 'CONNECT']
//             },
//             {
//                 id: squadRole.id,
//                 allow: [
//                     'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'
//                 ],
//             },
//         ],
//     })
//     const squadText = await m.guild.channels.create('🔐-squad-text', {
//         type: 'text',
//         parent: userSuppliedCatId,
//         reason: `LFG New Squad ${TKN}`,
//         permissionOverwrites: [
//             {
//                 id: everyoneRoleId,
//                 deny: ['VIEW_CHANNEL']
//             },
//             {
//                 id: squadRole.id,
//                 allow: [
//                     'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'READ_MESSAGE_HISTORY', 
//                     'ATTACH_FILES', 'EMBED_LINKS', 'ADD_REACTIONS',
//                 ],
//             },
//         ],
//     })
//     m.member.roles.add(squadRole.id)
//     squadText.send(formatOutput([
//         '**Welcome to your new squad!**',
//         'Players will continue to fill this channel until the squad is full.',
//         'Your party leader will be **MellowD#6992980**, please send friend requests in the event that invites are not working.',
//     ]))
//     const { voice: { channel } } = m.guild.member(m.author.id)
//     if (channel) {
//         // Moving only works if they're already in a voice channel
//         m.guild.member(m.author.id).voice.setChannel(squadVoice.id)
//     }
//     const instructions = [
//         `<@!${m.author.id}> Let's get started:`,
//     ]
//     if (!channel) {
//         instructions.push(`1. Join the \`🔐-squad-voice\` voice channel below`)
//     }
//     instructions.push(`${!channel ? '2' : '1'}. Send an invite to this channel for other players to join your party`)
//     squadText.send(formatOutput(instructions))
//     setTimeout(() => {
//         console.log('Cleaning up roles and channels')
//         squadRole.delete(`Squad ${TKN} disbanded`)
//         squadVoice.delete(`Squad ${TKN} disbanded`)
//         squadText.delete(`Squad ${TKN} disbanded`)
//         console.log('Cleanup completed')
//     }, 15000)
// }
// https://discord.com/oauth2/authorize?client_id=738240182670589993&scope=bot&permissions=268487696

