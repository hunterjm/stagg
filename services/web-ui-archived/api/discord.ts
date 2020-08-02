import * as Mongo from '@stagg/mdb'
import { Client } from 'discord.js'
import apiCfg from '../config/api'
import uiCfg from '../config/ui'
import { delay } from '@stagg/util'

Mongo.config(apiCfg.mongo)
const discord = new Client()
discord.login(apiCfg.discord.token)

export const profileById = async (id:string) => discord.users.fetch(id)
export const profileByEmail = async (email:string) => {
    const mongo = await Mongo.client()
    const player = await mongo.collection('accounts').findOne({ email })
    if (!player) return null
    if (!player.discord?.id) return null
    return profileById(player.discord?.id)
}

export const profile = async (req, res) => {
    const discord = req.query.id ? await profileById(req.query.id) : await profileByEmail(req.query.email)
    res.send({ ...discord })
}

export const server = async (req,res) => {
    let guild
    let attempts = 0
    while(!guild) {
        if (attempts > apiCfg.discord.attempts) {
            return res.send({ staff: [], members: [], online: [], error: 'unable to connect to Discord' })
        }
        guild = discord.guilds.resolve(discord.guilds.resolveID(uiCfg.discord.server.id))
        attempts++
        await delay(apiCfg.discord.delay)
    }
    const online = []
    const members = []
    const streamers = []
    const staffMembers = []
    const staffRoleIds = []
    const onlineMemberIds = []
    const streamingMemberIds = []
    for(const [, role] of guild.roles.cache) {
        if (apiCfg.discord.staffRoles.includes(role.name)) {
            staffRoleIds.push(role.id)
        }
    }
    for(const [,presence] of guild.presences.cache) {
        if (presence.status === 'online') {
            onlineMemberIds.push(presence.userID)
        }
    }
    for(const [mId, voiceState] of guild.voiceStates.cache) {
        if (voiceState.streaming) {
            streamingMemberIds.push(mId)
        }
    }
    for(const [, member] of guild.members.cache) {
        const memberProps = {
            id: member.user.id,
            bot: member.user.bot,
            avatar: member.user.avatar,
            username: member.user.username,
            discriminator: member.user.discriminator,
        }
        members.push({ ...memberProps })
        for(const roleId of member._roles) {
            if (staffRoleIds.includes(roleId)) {
                staffMembers.push({ ...memberProps })
            }
        }
        if (onlineMemberIds.includes(memberProps.id)) {
            online.push({ ...memberProps })
        }
        if (streamingMemberIds.includes(memberProps.id)) {
            streamers.push({ ...memberProps })
        }
    }
    const staff = staffMembers.sort((a,b) => (a.username.length + a.discriminator.length) - (b.username.length + b.discriminator.length))
    res.send({ staff, streamers, online, members })
}
