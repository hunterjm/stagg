import { Schema } from 'callofduty'
import { CallOfDuty } from '@stagg/db'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Player Objective Stats
 ***********************************************************************************************************/
export const MwWzMatchObjectiveNormalizer = (match:Schema.MW.Match.MP, account:CallOfDuty.Account.Base.Entity, detail:CallOfDuty.Match.MW.WZ.Detail.Entity):Partial<CallOfDuty.Match.MW.WZ.Objective.Entity>[] => {
  const objectives = []
  for(const objectiveId of Object.keys(match.playerStats)) {
    const objectivesEarned = Number(match.playerStats[objectiveId])
    if (objectiveId.match(/^objective/) && objectivesEarned && !isNaN(objectivesEarned)) {
      objectives.push({ 
        match: detail, 
        account, 
        objectiveId, 
        objectivesEarned 
      } as CallOfDuty.Match.MW.WZ.Objective.Entity)
    }
  }
  return objectives
}