import { config } from 'src/config'

export type Rank = { id: number, tier: number, qualifier: number, label: string }
export type Stats = { scorePerGame: number, killsPerGame: number, killsPerDeath: number }

const romanNumeral = (count:number) => {
    if (count === 4) return 'IV'
    let q = ''
    for(let i = 0; i < count; i++) q += 'I'
    return q
}

export const wzRank = (
    games:number,
    score:number,
    kills:number,
    deaths:number,
):Rank => {
    const tierByStat:Stats = { scorePerGame: 0, killsPerGame: 0, killsPerDeath: 0 }
    const playerStats:Stats = { scorePerGame: score / games, killsPerGame: kills / games, killsPerDeath: kills / deaths }
    for(const stat in config.callofduty.wz.ranking.thresholds) {
        for(const cutoffRank in config.callofduty.wz.ranking.thresholds[stat as keyof Stats]) {
            if (playerStats[stat as keyof Stats] >= config.callofduty.wz.ranking.thresholds[stat as keyof Stats][cutoffRank]) {
                tierByStat[stat as keyof Stats] = Number(cutoffRank) + 1
            } else {
                continue
            }
        }
    }
    let rankTotal = 0
    let weightTotal = 0
    for(const stat in tierByStat) {
        weightTotal += config.callofduty.wz.ranking.weights[stat as keyof Stats]
        rankTotal += tierByStat[stat as keyof Stats] * config.callofduty.wz.ranking.weights[stat as keyof Stats]
    }
    const ranksPerTier = (config.callofduty.wz.ranking.thresholds.scorePerGame.length + 1) / config.callofduty.wz.ranking.tiers.length
    const rankIndex = Math.round(rankTotal / weightTotal)
    const tier = Math.floor(rankIndex / ranksPerTier)
    const qualifier = (rankIndex % ranksPerTier) + 1
    const FINAL_RANK = { id: rankIndex + 1, tier, qualifier, label: `${config.callofduty.wz.ranking.tiers[tier]} ${romanNumeral(qualifier)}` }
    return FINAL_RANK
}
