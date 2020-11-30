import { Schema } from 'callofduty'
import { CallOfDuty } from '@stagg/db'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Details
 ***********************************************************************************************************/
export const MwMpMatchDetailsNormalizer = (match:Schema.MW.Match.MP): Partial<CallOfDuty.Match.MW.MP.Detail.Entity> => ({
  matchId: match.matchID,
  modeId: match.mode,
  mapId: match.map,
  endTime: match.utcEndSeconds,
  startTime: match.utcStartSeconds,
} as CallOfDuty.Match.MW.MP.Detail.Entity)
