import axios from 'axios'
import * as Discord from 'discord.js'
import { config } from './config'

let active = false
const client = new Discord.Client()

const connectDiscord = () => new Promise<void>((resolve) => {
    if (active) return resolve()
    client.login(config.discord.client.token)
    client.on('ready', () => (active = true) && resolve())
})

export const runJob = async (discord_id:string, limit:string='7d', skip:string='') => {
    if (!discord_id) {
        console.log('[!] Returning empty, no discord id')
        return
    }
    await connectDiscord()
    for(const guild of client.guilds.cache.array()) {
        const member = await getGuildMember(guild, discord_id)
        if (!member) {
            continue
        }
        try {
            await persistRoles(guild)
            await assignRole(member, guild, limit, skip)
        } catch(e) {
            console.log('[!] Role assignment failure:', e)
        }
    }
}

async function getGuildMember(guild:Discord.Guild, userId:string) {
    try {
        console.log(`[?] Inspecting guild "${guild.name}" (${guild.id}) for user id ${userId}`)
        const member = await guild.members.fetch({ user: userId })
        return member
        // ^ will throw error if member not found
    } catch(e) {
        return null
    }
}

async function persistRoles(guild:Discord.Guild) {
    const roleMap = {}
    const tierNames = []
    for(const tierName of config.callofduty.wz.ranking.tiers) {
        roleMap[tierName] = null
        tierNames.push(tierName)
    }
    const guildRoles = guild.roles.cache.array()
    const rankRelatedGuildRoles = guildRoles.filter(({ name }) => tierNames.find(t => name.includes(t)))
    for(const role of rankRelatedGuildRoles) {
        const tierName = tierNames.find(tierName => role.name.includes(tierName))
        roleMap[tierName] = role
    }
    const missingRoleTierNames = Object.keys(roleMap).filter(k => !roleMap[k])
    for(const missingRoleTierName of missingRoleTierNames) {
        console.log(`[+] Creating ranked role for ${missingRoleTierName} in "${guild.name}" (${guild.id})...`)
        const tierIndex = config.callofduty.wz.ranking.tiers.indexOf(missingRoleTierName)
        roleMap[missingRoleTierName] = await guild.roles.create({
            data: {
                position: tierIndex + 1,
                name: `WZ ${missingRoleTierName}`,
                color: config.discord.roles.ranking.colors[tierIndex],
            },
            reason: `Missing ranked role for ${missingRoleTierName} tier`
        })

    }
}

async function assignRole(member:Discord.GuildMember, guild:Discord.Guild, limit:string='7d', skip:string='') {
    const queries = ['modesExcluded=dmz', limit ? `limit=${limit}` : null, skip ? `skip=${skip}` : null]
    const apiUrl = `${config.network.host.api}/callofduty/discord/${member.user.id}/wz?${queries.filter(q => q).join('&')}`
    console.log('[>] Requesting API:', apiUrl)
    const { data: { rank } } = await axios.get(apiUrl)
    console.log('[.] Received rank from API:', rank)
    const guildRoles = guild.roles.cache.array()
    const allTierRoles = guildRoles.filter(({ name }) => config.callofduty.wz.ranking.tiers.find(tier => name.includes(tier)))
    console.log('[-] Removing all previous rank role assignments...')
    for(const tierRole of allTierRoles) {
        await member.roles.remove(tierRole.id)
    }
    const desiredGuildRole = guild.roles.cache.find(({ name }) => name.includes(config.callofduty.wz.ranking.tiers[rank.tier]))
    console.log(`[+] Assigning ranked role "${desiredGuildRole.name}"...`)
    await member.roles.add(desiredGuildRole.id)
}
