import { CallOfDuty } from '@stagg/db'
import { Schema } from 'callofduty'
import { getCustomRepository } from 'typeorm'
import { MwMpMatchDetailsNormalizer } from './mw.mp.details'
import { MwMpMatchKillstreakNormalizer } from './mw.mp.killstreak'
import { MwMpMatchLoadoutNormalizer } from './mw.mp.loadout'
import { MwMpMatchObjectiveNormalizer } from './mw.mp.objective'
import { MwMpMatchStatsNormalizer } from './mw.mp.stats'
import { MwMpMatchWeaponNormalizer } from './mw.mp.weapon'
import { MwWzMatchDetailsNormalizer } from './mw.wz.details'
import { MwWzMatchLoadoutNormalizer } from './mw.wz.loadout'
import { MwWzMatchObjectiveNormalizer } from './mw.wz.objective'
import { MwWzMatchStatsNormalizer } from './mw.wz.stats'

export class CallOfDutyMatchService {
  private readonly MwMpMatchDetailsRepo: CallOfDuty.Match.MW.MP.Detail.Repository
  private readonly MwMpMatchStatsRepo: CallOfDuty.Match.MW.MP.Stats.Repository
  private readonly MwMpMatchKillstreakRepo: CallOfDuty.Match.MW.MP.Killstreak.Repository
  private readonly MwMpMatchLoadoutRepo: CallOfDuty.Match.MW.MP.Loadout.Repository
  private readonly MwMpMatchObjectiveRepo: CallOfDuty.Match.MW.MP.Objective.Repository
  private readonly MwMpMatchWeaponRepo: CallOfDuty.Match.MW.MP.Weapon.Repository
  private readonly MwWzMatchDetailsRepo: CallOfDuty.Match.MW.WZ.Detail.Repository
  private readonly MwWzMatchStatsRepo: CallOfDuty.Match.MW.WZ.Stats.Repository
  private readonly MwWzMatchLoadoutRepo: CallOfDuty.Match.MW.WZ.Loadout.Repository
  private readonly MwWzMatchObjectiveRepo: CallOfDuty.Match.MW.WZ.Objective.Repository
  constructor() {
    this.MwMpMatchDetailsRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Detail.Repository)
    this.MwMpMatchStatsRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Stats.Repository)
    this.MwMpMatchKillstreakRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Killstreak.Repository)
    this.MwMpMatchLoadoutRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Loadout.Repository)
    this.MwMpMatchObjectiveRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Objective.Repository)
    this.MwMpMatchWeaponRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Weapon.Repository)
    this.MwWzMatchDetailsRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Detail.Repository)
    this.MwWzMatchStatsRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Stats.Repository)
    this.MwWzMatchLoadoutRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Loadout.Repository)
    this.MwWzMatchObjectiveRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Objective.Repository)
  }
  private getResource(gameId: Schema.Game, gameType: Schema.GameType) {
    const gameKey = gameId.toLowerCase()
    const gameTypeKey = gameType.toLowerCase()
    const resources = {
      'mw/mp': {
        stats: {
          repo: this.MwMpMatchStatsRepo,
          normalizer: MwMpMatchStatsNormalizer
        },
        weapons: {
          repo: this.MwMpMatchWeaponRepo,
          normalizer: MwMpMatchWeaponNormalizer
        },
        killstreaks: {
          repo: this.MwMpMatchKillstreakRepo,
          normalizer: MwMpMatchKillstreakNormalizer
        },
        loadouts: {
          repo: this.MwMpMatchLoadoutRepo,
          normalizer: MwMpMatchLoadoutNormalizer
        },
        objectives: {
          repo: this.MwMpMatchObjectiveRepo,
          normalizer: MwMpMatchObjectiveNormalizer
        },
        details: {
          repo: this.MwMpMatchDetailsRepo,
          normalizer: MwMpMatchDetailsNormalizer
        }
      },
      'mw/wz': {
        stats: {
          repo: this.MwWzMatchStatsRepo,
          normalizer: MwWzMatchStatsNormalizer
        },
        loadouts: {
          repo: this.MwWzMatchLoadoutRepo,
          normalizer: MwWzMatchLoadoutNormalizer
        },
        objectives: {
          repo: this.MwWzMatchObjectiveRepo,
          normalizer: MwWzMatchObjectiveNormalizer
        },
        details: {
          repo: this.MwWzMatchDetailsRepo,
          normalizer: MwWzMatchDetailsNormalizer
        }
      }
    }
    const resourceKey = `${gameKey}/${gameTypeKey}`
    if (!resources[resourceKey]) {
      throw `unsupported game/mode "${gameId}"/"${gameType}"`
    }
    return resources[resourceKey]
  }
  public async updateMatchRecord(matchId: string, accountId: string, gameId: Schema.Game, gameType: Schema.GameType, updates: any) {
    const resource = this.getResource(gameId, gameType)
    if (!resource) {
      throw `unsupported resource type "${gameId}/${gameType}"`
    }
    const combinedId = `${matchId}.${accountId}`
    await resource.stats.repo.updateStats({ combinedId, matchId, accountId, ...updates })
  }
  public async insertMatchRecord(account: CallOfDuty.Account.Base.Entity, gameId: Schema.Game, gameType: Schema.GameType, match: Schema.Match) {
    const resource = this.getResource(gameId, gameType)
    if (!resource) {
      throw `unsupported resource type "${gameId}/${gameType}"`
    }
    let detail
    try {
      detail = resource.details.normalizer(match)
      await resource.details.repo.insertDetail(detail)
    } catch (e) {
      // no big deal if this fails, match details could already exist
    }
    try {
      await resource.stats.repo.insertStats(resource.stats.normalizer(match, account))
    } catch (e) {
      throw `something went wrong, please try again: ${e}`
    }
    // TODO: pick up from here making sure normailzers and repos have the right params
    if (resource.weapons) {
      try {
        const normalized = resource.weapons.normalizer(match, account, detail)
        if (Array.isArray(normalized)) {
          for (const record of normalized) {
            await resource.weapons.repo.insertWeapon(record)
          }
        } else {
          await resource.weapons.repo.insertWeapon(normalized)
        }
      } catch (e) { console.log('Normalizing weapon failed', e) }
    }
    if (resource.loadouts) {
      try {
        const normalized = resource.loadouts.normalizer(match, account, detail)
        if (Array.isArray(normalized)) {
          for (const record of normalized) {
            await resource.loadouts.repo.insertLoadout(record)
          }
        } else {
          await resource.loadouts.repo.insertLoadout(normalized)
        }
      } catch (e) { console.log('Normalizing loadouts failed', e) }
    }
    if (resource.killstreaks) {
      try {
        const normalized = resource.killstreaks.normalizer(match, account, detail)
        if (Array.isArray(normalized)) {
          for (const record of normalized) {
            await resource.killstreaks.repo.insertKillstreak(record)
          }
        } else {
          await resource.killstreaks.repo.insertKillstreak(normalized)
        }
      } catch (e) { console.log('Normalizing killstreaks failed', e) }
    }
    if (resource.objectives) {
      try {
        const normalized = resource.objectives.normalizer(match, account, detail)
        if (Array.isArray(normalized)) {
          for (const record of normalized) {
            await resource.objectives.repo.insertObjective(record)
          }
        } else {
          await resource.objectives.repo.insertObjective(normalized)
        }
      } catch (e) { console.log('Normalizing objectives failed', e) }
    }
  }
}
