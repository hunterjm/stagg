import { CallOfDuty } from '@stagg/db'
import { Schema } from 'callofduty'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Details
 ***********************************************************************************************************/
export const MwWzMatchDetailsNormalizer = (match:Schema.MW.Match.WZ): Partial<CallOfDuty.Match.MW.WZ.Detail.Entity> => ({
  matchId: match.matchID,
  modeId: match.mode,
  mapId: match.map,
  endTime: match.utcEndSeconds,
  startTime: match.utcStartSeconds,
} as CallOfDuty.Match.MW.WZ.Detail.Entity)
