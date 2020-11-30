import { Injectable } from '@nestjs/common'
import { Schema } from 'callofduty'
import {
  BadRequestException,
} from '@nestjs/common'
import { CallOfDuty } from '@stagg/db'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CallOfDutyMatchService {
  constructor(
    @InjectRepository(CallOfDuty.Match.MW.MP.Detail.Repository, 'callofduty') 
    private readonly MwMpMatchDetailsRepo: CallOfDuty.Match.MW.MP.Detail.Repository,
    @InjectRepository(CallOfDuty.Match.MW.MP.Stats.Repository, 'callofduty') 
    private readonly MwMpMatchStatsRepo: CallOfDuty.Match.MW.MP.Stats.Repository,
    @InjectRepository(CallOfDuty.Match.MW.MP.Killstreak.Repository, 'callofduty') 
    private readonly MwMpMatchKillstreakRepo: CallOfDuty.Match.MW.MP.Killstreak.Repository,
    @InjectRepository(CallOfDuty.Match.MW.MP.Loadout.Repository, 'callofduty') 
    private readonly MwMpMatchLoadoutRepo: CallOfDuty.Match.MW.MP.Loadout.Repository,
    @InjectRepository(CallOfDuty.Match.MW.MP.Objective.Repository, 'callofduty') 
    private readonly MwMpMatchObjectiveRepo: CallOfDuty.Match.MW.MP.Objective.Repository,
    @InjectRepository(CallOfDuty.Match.MW.MP.Weapon.Repository, 'callofduty') 
    private readonly MwMpMatchWeaponRepo: CallOfDuty.Match.MW.MP.Weapon.Repository,
    @InjectRepository(CallOfDuty.Match.MW.WZ.Detail.Repository, 'callofduty') 
    private readonly MwWzMatchDetailsRepo: CallOfDuty.Match.MW.WZ.Detail.Repository,
    @InjectRepository(CallOfDuty.Match.MW.WZ.Stats.Repository, 'callofduty') 
    private readonly MwWzMatchStatsRepo: CallOfDuty.Match.MW.WZ.Stats.Repository,
    @InjectRepository(CallOfDuty.Match.MW.WZ.Loadout.Repository, 'callofduty') 
    private readonly MwWzMatchLoadoutRepo: CallOfDuty.Match.MW.WZ.Loadout.Repository,
    @InjectRepository(CallOfDuty.Match.MW.WZ.Objective.Repository, 'callofduty') 
    private readonly MwWzMatchObjectiveRepo: CallOfDuty.Match.MW.WZ.Objective.Repository
  ) {}
  private getResource(gameId: Schema.Game, gameType: Schema.GameType) {
    const gameKey = gameId.toLowerCase()
    const gameTypeKey = gameType.toLowerCase()
    const resources = {
      'mw/mp': {
        stats: this.MwMpMatchStatsRepo,
        weapons: this.MwMpMatchWeaponRepo,
        killstreaks: this.MwMpMatchKillstreakRepo,
        loadouts: this.MwMpMatchLoadoutRepo,
        objectives: this.MwMpMatchObjectiveRepo,
        details: this.MwMpMatchDetailsRepo
      },
      'mw/wz': {
        stats: this.MwWzMatchStatsRepo,
        loadouts: this.MwWzMatchLoadoutRepo,
        objectives: this.MwWzMatchObjectiveRepo,
        details: this.MwWzMatchDetailsRepo
      }
    }
    const resourceKey = `${gameKey}/${gameTypeKey}`
    if (!resources[resourceKey]) {
      throw new BadRequestException(`unsupported game/mode "${gameId}"/"${gameType}"`)
    }
    return resources[resourceKey]
  }
  public async getHistoryByAccountId(accountId: string, gameId: Schema.Game, gameType: Schema.GameType, limit?: number, offset?: number) {
    const resource = this.getResource(gameId, gameType)
    return await resource.stats.findByAccountId(accountId, limit, offset)
  }
}
