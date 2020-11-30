import { Schema, Assets } from 'callofduty'
import { CallOfDuty } from '@stagg/db'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Killstreak Stats
 ***********************************************************************************************************/
export const MwMpMatchKillstreakNormalizer = ({ player, playerStats }:Schema.MW.Match.MP, account:CallOfDuty.Account.Base.Entity, detail:CallOfDuty.Match.MW.MP.Detail.Entity):Partial<CallOfDuty.Match.MW.MP.Killstreak.Entity>[] => {
  const killstreaks = []
  for(const killstreakId in Assets.MW.Killstreaks) {
      const { props } = Assets.MW.Killstreak(killstreakId as Schema.Killstreak)
      const uses = player.killstreakUsage[killstreakId] || 0
      const kills = playerStats[props.kills] || 0
      const takedowns = playerStats[props.takedowns] || 0
      if (!uses && !kills && !takedowns) {
        continue
      }
      killstreaks.push({
        match: detail,
        account,
        killstreakId: killstreakId as Schema.Killstreak,
        uses,
        kills,
        takedowns
      } as CallOfDuty.Match.MW.MP.Killstreak.Entity)
  }
  return killstreaks
}
