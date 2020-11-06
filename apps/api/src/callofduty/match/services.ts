import { Injectable, InternalServerErrorException, } from '@nestjs/common'
import { Schema } from 'callofduty'
import {
    BadRequestException,
} from '@nestjs/common'
import * as NormalizeMatch from './normalize'
import {
    MwMpMatchRecord,
    MwWzMatchRecord,
    MwMpMatchDetails,
    MwWzMatchDetails,
    MwMpMatchRecordDAO,
    MwWzMatchRecordDAO,
    MwMpMatchDetailsDAO,
    MwWzMatchDetailsDAO,
  } from 'src/callofduty/match/entity'
import { Account, AccountDAO } from 'src/callofduty/account/entity'
import { PGSQL } from 'src/config'

@Injectable()
export class CallOfDutyMatchService {
  constructor(
    private readonly AccountDao: AccountDAO,
    private readonly MwMpRecordDao: MwMpMatchRecordDAO,
    private readonly MwMpDetailsDao: MwMpMatchDetailsDAO,
    private readonly MwWzRecordDao: MwWzMatchRecordDAO,
    private readonly MwWzDetailsDao: MwWzMatchDetailsDAO,
  ) {}
  private getResource(gameId:Schema.Game, gameType:Schema.GameType) {
    const gameKey = gameId.toLowerCase()
    const gameTypeKey = gameType.toLowerCase()
    const resources = {
      'mw/mp': {
        record: {
          dao: this.MwMpRecordDao,
          normalizer: NormalizeMatch.MwMpRecord
        },
        details: {
          dao: this.MwMpDetailsDao,
          normalizer: NormalizeMatch.MwMpDetails
        }
      },
      'mw/wz': {
        record: {
          dao: this.MwWzRecordDao,
          normalizer: NormalizeMatch.MwWzRecord
        },
        details: {
          dao: this.MwWzDetailsDao,
          normalizer: NormalizeMatch.MwWzDetails
        }
      }
    }
    const resourceKey = `${gameKey}/${gameTypeKey}`
    if (!resources[resourceKey]) {
      throw new BadRequestException(`unsupported game/mode "${gameId}"/"${gameType}"`)
    }
    return resources[resourceKey]
  }
  public async updateMatchRecord(matchId:string, accountId:string, gameId:Schema.Game, gameType:Schema.GameType, updates:any) {
    const resource = this.getResource(gameId, gameType)
    await resource.record.dao.update({ matchId, accountId, ...updates })
  }
  public async insertMatchRecord(accountId:string, gameId:Schema.Game, gameType:Schema.GameType, match:Schema.Match) {
    const resource = this.getResource(gameId, gameType)
    try {
      const normalizedDetails = resource.details.normalizer(match)
      await resource.details.dao.insert(normalizedDetails)
    } catch(e) {
      // no big deal if this fails, match details could already exist
    }
    const normalizedModel = {
        accountId,
        ...resource.record.normalizer(match)
    }
    try {
      await resource.record.dao.insert(normalizedModel)
    } catch(e) {
      if (String(e.code) === String(PGSQL.CODE.DUPLICATE)) {
        throw new BadRequestException(`duplicate match record for ${gameId}/${gameType}/${match.matchID}/${accountId}`)
      }
      throw new InternalServerErrorException('something went wrong, please try again')
    }
  }
  // public async getAggregatedStats(accountId:string, gameId:Schema.API.Game, gameType:Schema.API.GameType) {

  // }
}
