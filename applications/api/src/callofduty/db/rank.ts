import { CONFIG } from 'src/config'

export const wzRank = (score:number, kills:number, deaths:number, damageDone:number, damageTaken:number) => {
    const factors = [
        { weight: CONFIG.RANKING.WZ.KDR.weight,   limitValue: CONFIG.RANKING.WZ.KDR.limit,    statValue: kills / (deaths || 1) },
        { weight: CONFIG.RANKING.WZ.DDR.weight,   limitValue: CONFIG.RANKING.WZ.DDR.limit,    statValue: damageDone / (damageTaken || 1) },
        { weight: CONFIG.RANKING.WZ.SCORE.weight, limitValue: CONFIG.RANKING.WZ.SCORE.limit,  statValue: score },
    ]
    const factoredScores = []
    for(const factor of factors) {
        for(let i = 0; i < factor.weight; i++) {
            const value = factor.statValue / factor.limitValue
            factoredScores.push(Math.min(value, 1))
        }
    }
    if (!factoredScores.length) {
        return { rankId: 1, rankLabel: 'Bronze I' }
    }
    const sum = factoredScores.reduce((a,b) => a+b)
    const avg = sum / factoredScores.length
    const rankValue = 1 + Math.max(0, Math.round(avg * (CONFIG.RANKING.tierNames.length * CONFIG.RANKING.ranksPerTier)))
    const rankTier = Math.floor(rankValue / CONFIG.RANKING.ranksPerTier)
    let rankQualifier = 'I'
    for(let i = 1; i < rankValue - (rankTier * CONFIG.RANKING.ranksPerTier); i++) {
        rankQualifier += 'I'
    }

    return { id: rankValue, label: `${CONFIG.RANKING.tierNames[rankTier]} ${rankQualifier}` }
}
