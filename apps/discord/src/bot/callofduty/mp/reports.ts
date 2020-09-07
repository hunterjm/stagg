import * as Mongo from '@stagg/mdb'
import { commaNum, percentage } from '@stagg/util'
import { Multiplayer as MPReports } from '../data'

export const all = async (player: Mongo.Schema.CallOfDuty.Account, platform: string = 'uno'): Promise<string[]> => {
    const data = await MPReports.statsReport(player, [], false)
    const output = [
        `**${player.profiles[platform]}** (${player.profiles?.id})`,
        '```'
    ]
    for (const modeData of data) {
        output.push('', ...formatOutput(modeData, modeData._id))
    }
    return [...output, '```']
}
const formatOutput = (statsCluster:any, label: string): string[] => {
    return [
        `MW Multiplayer${label ? ` ${label}` : ''}`,
        '--------------------------------',
        `Games: ${commaNum(statsCluster.games)}`,
        `Wins: ${commaNum(statsCluster.wins)}`,
        `Win rate: ${percentage(statsCluster.wins, statsCluster.games)}`,
        `Losses: ${commaNum(statsCluster.losses)}`,
        `Draws: ${commaNum(statsCluster.draws)}`,
        `Kills: ${commaNum(statsCluster.kills)}`,
        `Assists: ${commaNum(statsCluster.assists)}`,
        `Deaths: ${commaNum(statsCluster.deaths)}`,
        `Kills per death: ${(statsCluster.kills/statsCluster.deaths).toFixed(2)}`,
        `Loadouts: ${commaNum(statsCluster.loadouts)}`,
        `Accuracy: ${percentage(statsCluster.shotsLanded, statsCluster.shotsLanded + statsCluster.shotsMissed)}`,
        `Headshots: ${commaNum(statsCluster.headshots)}`,
        `Average highest killstreak: ${commaNum(statsCluster.avgLongestStreak.toFixed(2))}`,
        `Average time played: ${(statsCluster.timePlayed/statsCluster.games).toFixed(2)}`,
        `Total time played: ${commaNum(statsCluster.timePlayed)}`,
        `Rage quits: ${commaNum(statsCluster.rageQuits)}`,
        `Rage quit rate: ${percentage(statsCluster.rageQuits, statsCluster.games)}`
    ]
}