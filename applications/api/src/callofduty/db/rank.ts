import { CONFIG } from 'src/config'

const romanNumeral = (count:number) => {
    if (count === 4) return 'IV'
    let q = ''
    for(let i = 1; i < count; i++) q += 'I'
    return q
}

export const wzRank = (games:number, score:number, kills:number, deaths:number, damageDone:number, damageTaken:number) => {
    const factors = [
        { weight: CONFIG.RANKING.WZ.KDR.weight,   limitValue: CONFIG.RANKING.WZ.KDR.limit,    statValue: kills / (deaths || 1) },
        { weight: CONFIG.RANKING.WZ.DDR.weight,   limitValue: CONFIG.RANKING.WZ.DDR.limit,    statValue: damageDone / (damageTaken || 1) },
        { weight: CONFIG.RANKING.WZ.KILLS.weight, limitValue: CONFIG.RANKING.WZ.KILLS.limit,  statValue: kills / games },
        { weight: CONFIG.RANKING.WZ.SCORE.weight, limitValue: CONFIG.RANKING.WZ.SCORE.limit,  statValue: score / games },
    ]
    const factoredScores = []
    for(const factor of factors) {
        for(let i = 0; i < factor.weight; i++) {
            const value = factor.statValue / factor.limitValue
            factoredScores.push(Math.min(value, 1))
        }
    }
    if (!factoredScores.length) {
        return { id: 1, label: 'Bronze I' }
    }
    const sum = factoredScores.reduce((a,b) => a+b)
    const avg = sum / factoredScores.length
    const rankValue = 1 + Math.max(0, Math.round(avg * (CONFIG.RANKING.tierNames.length * CONFIG.RANKING.ranksPerTier)))
    const rankTier = Math.floor((rankValue - 1) / CONFIG.RANKING.ranksPerTier)
    const rankQualifiers = rankValue - (rankTier * CONFIG.RANKING.ranksPerTier)

    return { id: rankValue, label: `${CONFIG.RANKING.tierNames[rankTier]} ${romanNumeral(rankQualifiers)}` }
}
