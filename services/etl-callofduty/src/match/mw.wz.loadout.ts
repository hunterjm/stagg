import { Schema } from 'callofduty'
import { CallOfDuty } from '@stagg/db'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Player Killstreak Stats
 ***********************************************************************************************************/
export const MwWzMatchLoadoutNormalizer = ({ player: { loadout } }:Schema.MW.Match.WZ, account:CallOfDuty.Account.Base.Entity, detail:CallOfDuty.Match.MW.WZ.Detail.Entity):Partial<CallOfDuty.Match.MW.WZ.Loadout.Entity>[] => loadout.map(loadout => ({
  match: detail,
  account,
  pwId: loadout.primaryWeapon.name,
  pwVariant: Number(loadout.primaryWeapon.variant),
  pwAttachments: loadout.primaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
  swId: loadout.secondaryWeapon.name,
  swVariant: Number(loadout.secondaryWeapon.variant),
  swAttachments: loadout.secondaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
  lethal: loadout.lethal.name,
  tactical: loadout.tactical.name,
  perks: loadout.perks.filter(p => p.name !== 'specialty_null').map(perk => perk.name)
} as CallOfDuty.Match.MW.WZ.Loadout.Entity))
