import { spaces } from '@stagg/util'
import * as Discord from 'discord.js'
import relay from '../../relay'
import { hydratePlayerIdentifiers, Warzone as WarzoneReports } from '../data'

export default async (m:Discord.Message, ...pids:string[]) => {
    const rly = await relay(m, ['Loading players...'])
    const foundPlayers = await hydratePlayerIdentifiers(m.author.id, pids)
    if (!foundPlayers.length) {
        rly.edit(['Players not found...'])
        return
    }
    // if (foundPlayers.length < 5) {
    //     rly.edit(['Team building requires at least 5 players...'])
    //     return
    // }
    rly.edit(['Building player profiles...'])
    const stats:[string, number][] = [] // [key,val]
    for(const fp of foundPlayers) {
        const stat = 'damageDone/timePlayed'
        const dmgPerSecArr = await WarzoneReports.ratioStat(fp.player, stat)
        let total = 0
        for(const dmg of dmgPerSecArr) total += dmg[stat]
        stats.push([fp.player.profiles?.uno || fp.query.tag, total / dmgPerSecArr.length])
    }
    const sorted = stats.sort((a,b) => a[1]-b[1])
    const minTeams = Math.ceil(sorted.length / 4)

    const teams = []
    const idealTeamSize = Math.ceil(sorted.length / minTeams)
    for(const [uno, rank] of sorted) {
        if (!teams.length) {
            teams.push([])
        }
        if (teams[teams.length-1].length >= idealTeamSize) {
            teams.push([])
        }
        teams[teams.length-1].push([uno, rank])
    }

    const output = []
    let i = 1
    const longestNameChars = Math.max(...sorted.map(([k]) => k.length))
    for(const team of teams) {
        output.push(`\`\`\`Team #${i++}`)
        for(const [k,v] of team) {
            const extraSpaces = spaces(longestNameChars - k.length)
            output.push(`${k}${extraSpaces}   (${v.toFixed(2)})`)
        }
        output.push('```')
    }
    rly.edit(output)
}