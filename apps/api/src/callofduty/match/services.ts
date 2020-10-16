import { Injectable, InternalServerErrorException, } from '@nestjs/common'
import { Schema } from '@stagg/callofduty'
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
import { AccountDAO } from 'src/callofduty/account/entity'
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
  public async insertMatchRecord(accountId:string, gameId:Schema.API.Game, gameType:Schema.API.GameType, match:Schema.API.MW.Match) {
    const gameKey = gameId.toUpperCase()
    const gameTypeKey = gameType.toUpperCase()
    if (!NormalizeMatch[gameKey]) {
        throw new BadRequestException(`invalid or unsupported game "${gameId}"`)
    }
    if (!NormalizeMatch[gameKey][gameTypeKey]) {
        throw new BadRequestException(`invalid or unsupported mode "${gameType}"`)
    }
    if (!NormalizeMatch[gameKey][gameTypeKey].Record) {
        throw new BadRequestException(`unsupported game/mode "${gameId}"/"${gameType}"`)
    }
    const resources = {
      'mw/mp': {
        dao: this.MwMpRecordDao,
        normalizer: NormalizeMatch.MW.MP.Record
      }
    }
    const resourceKey = `${gameId}/${gameType}`
    if (!resources[resourceKey]) {
      throw new BadRequestException(`unsupported game/mode "${gameId}"/"${gameType}"`)
    }
    const resource = resources[resourceKey]
    const normalizedModel = {
        accountId,
        ...resource.normalizer(match as Schema.API.MW.MP.Match)
    }
    try {
      await resource.dao.insert(normalizedModel)
    } catch(e) {
      if (String(e.code) === String(PGSQL.CODE.DUPLICATE)) {
        throw new BadRequestException(`duplicate match record for ${gameId}/${gameType}/${match.matchID}/${accountId}`)
      }
      throw new InternalServerErrorException('something went wrong, please try again')
    }
  }
}
