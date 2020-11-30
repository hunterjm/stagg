import { Schema } from 'callofduty'
import { CallOfDuty } from '@stagg/db'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Weapon Stats
 ***********************************************************************************************************/
export const MwMpMatchWeaponNormalizer = (match:Schema.MW.Match.MP, account:CallOfDuty.Account.Base.Entity, detail: CallOfDuty.Match.MW.MP.Detail.Entity):Partial<CallOfDuty.Match.MW.MP.Weapon.Entity>[] => {
  const weapons = []
  for (const weaponId in match.weaponStats) {
      weapons.push({
        match: detail,
        account,
        weaponId,
        loadoutIndex: match.weaponStats[weaponId].loadoutIndex,
        kills: match.weaponStats[weaponId].kills,
        deaths: match.weaponStats[weaponId].deaths,
        headshots: match.weaponStats[weaponId].headshots,
        shotsHit: match.weaponStats[weaponId].hits,
        shotsMiss: match.weaponStats[weaponId].shots - match.weaponStats[weaponId].hits,
        xpStart: match.weaponStats[weaponId].startingWeaponXp,
        xpEarned: match.weaponStats[weaponId].xpEarned,
      } as CallOfDuty.Match.MW.MP.Weapon.Entity)
  }
  return weapons
}
