import { CallOfDuty } from '@stagg/db'
import { Schema } from 'callofduty'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Objective Stats
 ***********************************************************************************************************/
export const MwMpMatchObjectiveNormalizer = (match:Schema.MW.Match.MP, account:CallOfDuty.Account.Base.Entity, detail:CallOfDuty.Match.MW.MP.Detail.Entity): Partial<CallOfDuty.Match.MW.MP.Objective.Entity>[] => {
  const objectives = []
  for(const objectiveId of Object.keys(match.playerStats)) {
    const objectivesEarned = Number(match.playerStats[objectiveId])
    if (objectiveId.match(/^objective/) && objectivesEarned && !isNaN(objectivesEarned)) {
      objectives.push({  
        match: detail,
        account, 
        objectiveId, 
        objectivesEarned
      } as CallOfDuty.Match.MW.MP.Objective.Entity)
    }
  }
  return objectives
}
