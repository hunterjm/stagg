import * as Mongo from '@stagg/mdb'
import { Normalize } from '@stagg/callofduty'
import { commaNum, percentage } from '@stagg/util'
import { Warzone as WarzoneReports } from '../data'

const type = 'br' // may do plunder in future but meh
const header = (player:Mongo.Schema.CallOfDuty.Account, platform:string='uno'):string[] => [
    `**${player.profiles[platform]}** (${player.profiles?.id})`,
    `Full profile: https://stagg.co/wz/${player.profiles?.uno?.split('#').join('@')}`,
]
export const combined = async (player:Mongo.Schema.CallOfDuty.Account, platform:string='uno'):Promise<string[]> => {
    const data = await WarzoneReports.statsReport(player)
    return [
        ...header(player, platform),
        '```',
        '',
        ...formatOutput(data[0], 'Combined'),
        '```',
    ]
}
export const isolated = async (teamSize:number, player:Mongo.Schema.CallOfDuty.Account, platform:string='uno'):Promise<string[]> => {
    if (teamSize < 1 || teamSize > 4) {
        return ['Invalid request, team size must be between 1-4']
    }
    const teamSizeLables = ['Solos', 'Duos', 'Trios', 'Quads']
    // get all modeIds for this teamSize
    const modeIds = []
    for(const modeId in Normalize.MW.Modes) {
        const modeDetails = Normalize.MW.Modes[modeId]
        if (modeDetails.category === type && modeDetails.teamSize === teamSize) {
            modeIds.push(modeId)
        }
    }
    const data = await WarzoneReports.statsReport(player, modeIds)
    return [
        ...header(player, platform),
        '```',
        '',
        ...formatOutput(data[0], teamSizeLables[teamSize-1]),
        '```',
    ]
}
export const all = async (player:Mongo.Schema.CallOfDuty.Account, platform:string='uno'):Promise<string[]> => {
    const data = await WarzoneReports.statsReport(player, [], true)
    const teamSizeLables = ['Combined', 'Solos', 'Duos', 'Trios', 'Quads']
    const output = [
        ...header(player, platform),
        '```'
    ]
    // Combine groups from different modeIds of the same teamSize
    const groupedByTeamSizeLabel = {}
    for(const modeData of data) {
        const modeDetails = Normalize.MW.Modes[modeData._id]
        if (!modeDetails || modeDetails.category !== type) {
            continue
        }
        const dataGroup = groupedByTeamSizeLabel[teamSizeLables[modeDetails.teamSize]]
        if (!dataGroup) {
            groupedByTeamSizeLabel[teamSizeLables[modeDetails.teamSize]] = { ...modeData }
            continue
        }
        // merge the existing and new stats together
        for(const key in dataGroup) {
            groupedByTeamSizeLabel[teamSizeLables[modeDetails.teamSize]][key] = dataGroup[key] + modeData[key]
        }
    }
    for(const label of Object.keys(groupedByTeamSizeLabel).sort((a,b) => teamSizeLables.indexOf(a) - teamSizeLables.indexOf(b))) {
        output.push('', ...formatOutput(groupedByTeamSizeLabel[label], label))
    }
    return [...output, '```']
}
const formatOutput = (statsCluster:any, label:string):string[] => {
    return [
        `WZ BR ${label}:`,
        '--------------------------------',
        `Wins: ${commaNum(statsCluster.wins)}`,
        `Games: ${commaNum(statsCluster.games)}`,
        `Kills: ${commaNum(statsCluster.kills)}`,
        `Downs: ${commaNum(statsCluster.downs)}`,
        `Deaths: ${commaNum(statsCluster.deaths)}`,
        `Loadouts: ${commaNum(statsCluster.loadouts)}`,
        `Win rate: ${percentage(statsCluster.wins, statsCluster.games)}%`,
        `Top 5 rate: ${percentage(statsCluster.top5, statsCluster.games)}%`,
        `Top 10 rate: ${percentage(statsCluster.top10, statsCluster.games)}%`,
        `Gulag win rate: ${percentage(statsCluster.gulagWins, statsCluster.gulagGames)}%`,
        `Kills per death: ${(statsCluster.kills/statsCluster.deaths).toFixed(2)}`,
        `Damage per kill: ${commaNum(Math.round(statsCluster.damageDone / statsCluster.kills))}`,
        `Damage per death: ${commaNum(Math.round(statsCluster.damageTaken / statsCluster.deaths))}`,
    ]
}
