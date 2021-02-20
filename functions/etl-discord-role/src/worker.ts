import axios from 'axios'
import * as Discord from 'discord.js'
import { SECRETS, CONFIG } from './config'

let active = false
const client = new Discord.Client()

const connectDiscord = () => new Promise<void>((resolve) => {
    if (active) return resolve()
    client.login(SECRETS.DISCORD_CLIENT_TOKEN)
    client.on('ready', () => (active = true) && resolve())
})

export async function runJob(discord_id:string, limit:string='7d', skip:string='') {
    await connectDiscord()
    for(const guild of client.guilds.cache.array()) {
        try {
            console.log(`[?] Inspecting guild "${guild.name}" (${guild.id}) for user id ${discord_id}`)
            const member = await guild.members.fetch({ user: discord_id })
            // ^ will throw error if member not found
            await persistRoles(guild)
            await assignRole(member, guild, limit, skip)
        } catch(e) {}
    }
}

async function persistRoles(guild:Discord.Guild) {
    const roleMap = {}
    const tierNames = []
    for(const tierName of CONFIG.TIER_NAMES) {
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
        const tierIndex = CONFIG.TIER_NAMES.indexOf(missingRoleTierName)
        roleMap[missingRoleTierName] = await guild.roles.create({
            data: {
                position: tierIndex + 1,
                name: `WZ ${missingRoleTierName}`,
                color: CONFIG.TIER_COLORS[tierIndex],
            },
            reason: `Missing ranked role for ${missingRoleTierName} tier`
        })
    }
}

async function assignRole(member:Discord.GuildMember, guild:Discord.Guild, limit:string='7d', skip:string='') {
    const queries = ['modesExcluded=dmz', limit ? `limit=${limit}` : null, skip ? `skip=${skip}` : null]
    const apiUrl = `${CONFIG.API_HOST}/callofduty/db/discord/${member.user.id}/wz?${queries.filter(q => q).join('&')}`
    console.log('[>] Requesting API:', apiUrl)
    const { data: { rank } } = await axios.get(apiUrl)
    console.log('[.] Received rank from API:', rank)
    const guildRoles = guild.roles.cache.array()
    const allTierRoles = guildRoles.filter(({ name }) => CONFIG.TIER_NAMES.find(tier => name.includes(tier)))
    console.log('[-] Removing all previous rank role assignments...')
    for(const tierRole of allTierRoles) {
        await member.roles.remove(tierRole.id)
    }
    const desiredGuildRole = guild.roles.cache.find(({ name }) => name.includes(CONFIG.TIER_NAMES[rank.tier]))
    console.log(`[+] Assigning ranked role "${desiredGuildRole.name}"...`)
    await member.roles.add(desiredGuildRole.id)
}
