import { Injectable, InternalServerErrorException, } from '@nestjs/common'
import { Schema } from 'callofduty'
import {
    BadRequestException,
} from '@nestjs/common'
import * as NormalizeMatch from './normalize'
import {
  MwMpMatchDetails,
  MwMpMatchDetailsDAO,
  MwMpMatchDetailsNormalizer,
  MwMpMatchStats,
  MwMpMatchStatsDAO,
  MwMpMatchStatsNormalizer,
  MwMpMatchKillstreak,
  MwMpMatchKillstreakDAO,
  MwMpMatchKillstreakNormalizer,
  MwMpMatchLoadout,
  MwMpMatchLoadoutDAO,
  MwMpMatchLoadoutNormalizer,
  MwMpMatchObjective,
  MwMpMatchObjectiveDAO,
  MwMpMatchObjectiveNormalizer,
  MwMpMatchWeapon,
  MwMpMatchWeaponDAO,
  MwMpMatchWeaponNormalizer,
  MwWzMatchDetails,
  MwWzMatchDetailsDAO,
  MwWzMatchDetailsNormalizer,
  MwWzMatchStats,
  MwWzMatchStatsDAO,
  MwWzMatchStatsNormalizer,
  MwWzMatchLoadout,
  MwWzMatchLoadoutDAO,
  MwWzMatchLoadoutNormalizer,
  MwWzMatchObjective,
  MwWzMatchObjectiveDAO,
  MwWzMatchObjectiveNormalizer,
} from 'src/callofduty/match/entity'
import { Account, AccountDAO } from 'src/callofduty/account/entity'
import { PGSQL } from 'src/config'

@Injectable()
export class CallOfDutyMatchService {
  constructor(
    private readonly AccountDao: AccountDAO,
    private readonly MwMpMatchDetailsDAO: MwMpMatchDetailsDAO,
    private readonly MwMpMatchStatsDAO: MwMpMatchStatsDAO,
    private readonly MwMpMatchKillstreakDAO: MwMpMatchKillstreakDAO,
    private readonly MwMpMatchLoadoutDAO: MwMpMatchLoadoutDAO,
    private readonly MwMpMatchObjectiveDAO: MwMpMatchObjectiveDAO,
    private readonly MwMpMatchWeaponDAO: MwMpMatchWeaponDAO,
    private readonly MwWzMatchDetailsDAO: MwWzMatchDetailsDAO,
    private readonly MwWzMatchStatsDAO: MwWzMatchStatsDAO,
    private readonly MwWzMatchLoadoutDAO: MwWzMatchLoadoutDAO,
    private readonly MwWzMatchObjectiveDAO: MwWzMatchObjectiveDAO,
  ) {}
  private getResource(gameId:Schema.Game, gameType:Schema.GameType) {
    const gameKey = gameId.toLowerCase()
    const gameTypeKey = gameType.toLowerCase()
    const resources = {
      'mw/mp': {
        stats: {
          dao: this.MwMpMatchStatsDAO,
          normalizer: MwMpMatchStatsNormalizer
        },
        weapons: {
          dao: this.MwMpMatchWeaponDAO,
          normalizer: MwMpMatchWeaponNormalizer
        },
        killstreaks: {
          dao: this.MwMpMatchKillstreakDAO,
          normalizer: MwMpMatchKillstreakNormalizer
        },
        loadouts: {
          dao: this.MwMpMatchLoadoutDAO,
          normalizer: MwMpMatchLoadoutNormalizer
        },
        objectives: {
          dao: this.MwMpMatchObjectiveDAO,
          normalizer: MwMpMatchObjectiveNormalizer
        },
        details: {
          dao: this.MwMpMatchDetailsDAO,
          normalizer: MwMpMatchDetailsNormalizer
        }
      },
      'mw/wz': {
        stats: {
          dao: this.MwWzMatchStatsDAO,
          normalizer: MwWzMatchStatsNormalizer
        },
        loadouts: {
          dao: this.MwWzMatchLoadoutDAO,
          normalizer: MwWzMatchLoadoutNormalizer
        },
        objectives: {
          dao: this.MwWzMatchObjectiveDAO,
          normalizer: MwWzMatchObjectiveNormalizer
        },
        details: {
          dao: this.MwWzMatchDetailsDAO,
          normalizer: MwWzMatchDetailsNormalizer
        }
      }
    }
    const resourceKey = `${gameKey}/${gameTypeKey}`
    if (!resources[resourceKey]) {
      throw new BadRequestException(`unsupported game/mode "${gameId}"/"${gameType}"`)
    }
    return resources[resourceKey]
  }
  public async getHistoryByAccountId(accountId:string, gameId:Schema.Game, gameType:Schema.GameType) {
    const resource = this.getResource(gameId, gameType)
    return resource.stats.dao.findByAccountId(accountId)
  }
  public async updateMatchRecord(matchId:string, accountId:string, gameId:Schema.Game, gameType:Schema.GameType, updates:any) {
    const resource = this.getResource(gameId, gameType)
    await resource.stats.dao.update({ matchId, accountId, ...updates })
  }
  public async insertMatchRecord(accountId:string, gameId:Schema.Game, gameType:Schema.GameType, match:Schema.Match) {
    const resource = this.getResource(gameId, gameType)
    if (!resource) {
      throw new BadRequestException(`unsupported resource type "${gameId}/${gameType}"`)
    }
    try {
      const normalizedDetails = resource.details.normalizer(match)
      await resource.details.dao.insert(normalizedDetails)
    } catch(e) {
      // no big deal if this fails, match details could already exist
    }
    try {
      await resource.stats.dao.insert({
        accountId,
        ...resource.stats.normalizer(match, accountId)
      })
    } catch(e) {
      if (String(e.code) === String(PGSQL.CODE.DUPLICATE)) {
        throw new BadRequestException(`duplicate match record for ${gameId}/${gameType}/${match.matchID}/${accountId}`)
      }
      throw new InternalServerErrorException('something went wrong, please try again')
    }
    if (resource.weapons) {
      try {
        const normalized = resource.weapons.normalizer(match, accountId)
        if (Array.isArray(normalized)) {
          for(const record of normalized) {
            await resource.weapons.dao.insert({...record, accountId})
          }
        } else {
          await resource.weapons.dao.insert({...normalized, accountId})
        }
      } catch(e) { console.log('Normalizing weapon failed', e) }
    }
    if (resource.loadouts) {
      try {
        const normalized = resource.loadouts.normalizer(match, accountId)
        if (Array.isArray(normalized)) {
          for(const record of normalized) {
            await resource.loadouts.dao.insert({...record, accountId})
          }
        } else {
          await resource.loadouts.dao.insert({...normalized, accountId})
        }
      } catch(e) { console.log('Normalizing loadouts failed', e) }
    }
    if (resource.killstreaks) {
      try {
        const normalized = resource.killstreaks.normalizer(match, accountId)
        if (Array.isArray(normalized)) {
          for(const record of normalized) {
            await resource.killstreaks.dao.insert({...record, accountId})
          }
        } else {
          await resource.killstreaks.dao.insert({...normalized, accountId})
        }
      } catch(e) { console.log('Normalizing killstreaks failed', e) }
    }
    if (resource.objectives) {
      try {
        const normalized = resource.objectives.normalizer(match, accountId)
        if (Array.isArray(normalized)) {
          for(const record of normalized) {
            await resource.objectives.dao.insert({...record, accountId})
          }
        } else {
          await resource.objectives.dao.insert({...normalized, accountId})
        }
      } catch(e) { console.log('Normalizing objectives failed', e) }
    }
  }
  // public async getAggregatedStats(accountId:string, gameId:Schema.API.Game, gameType:Schema.API.GameType) {

  // }
}
