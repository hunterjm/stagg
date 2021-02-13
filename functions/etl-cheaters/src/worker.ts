import API from '@callofduty/api'
import { MW } from '@callofduty/types'
import { CallOfDuty } from '@stagg/db'
import { DbService } from './service'
import { CONFIG } from './config'

const isSus = (record:MW.Match.WZ):string[] => {
    const reasons:string[] = []
    for(const key in CONFIG.SUSPICION) {
        if (key === 'ratios') continue
        if (record.playerStats[key] >= CONFIG.SUSPICION[key]) {
            reasons.push(`unreasonable ${key}`)
        }
    }
    for(const ratio of CONFIG.SUSPICION.ratios) {
        if (ratio.threshold) {
            if (ratio.threshold.top > record.playerStats[ratio.top]) continue
            if (ratio.threshold.bottom > record.playerStats[ratio.bottom]) continue
        }
        if (record.playerStats[ratio.top]/(record.playerStats[ratio.bottom]||1) > ratio.limit) {
            reasons.push(`unreasonable ${ratio.top}/${ratio.bottom} ratio`)
        }
    }
    return reasons
}

export const worker = async (match_id:string):Promise<CallOfDuty.Sus.Entity[]> => {
    const api = new API()
    const db = new DbService()
    const suspects:CallOfDuty.Sus.Entity[] = []
    const existing = await db.getMatchInvesgitation(match_id)
    if (existing) {
        throw 'already investigated'
    }
    const matchDetails = await api.MatchDetails(match_id, 'wz', 'mw')
    if (!matchDetails) {
        throw 'invalid match_id'
    }
    for(const record of <MW.Match.WZ[]>matchDetails.allPlayers) {
        const reasons = isSus(record)
        if (reasons.length) {
            const suspect = {
                combined_id: `${record.player.uno}.${match_id}`,
                match_id,
                reasons,
                uno_id: record.player.uno,
                match_log: record,
            }
            suspects.push(suspect)
            await db.saveSuspect(suspect)
        }
    }
    await db.saveMatchInvesgitation(match_id)
    return suspects
}