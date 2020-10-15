import { Schema } from '@stagg/callofduty'
import {
    Controller,
    Get,
    Put,
    Patch,
    Param,
    Body,
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
// import { CallOfDutyAccountService } from 'src/callofduty/account/services'


@Controller('callofduty/match')
export class CallOfDutyMatchController {
    constructor(
        private readonly AccountDao: AccountDAO,
        private readonly MwMpRecordDao: MwMpMatchRecordDAO,
        private readonly MwMpDetailsDao: MwMpMatchDetailsDAO,
        private readonly MwWzRecordDao: MwWzMatchRecordDAO,
        private readonly MwWzDetailsDao: MwWzMatchDetailsDAO,
    ) {}
    @Put('/:gameId/:gameType/:matchId/events')
    async SaveMatchEvents(@Param() { gameId, gameType, matchId }):Promise<{ success: boolean }> {
        return { success: true }
    }

    @Put('/:gameId/:gameType/:matchId/:unoId')
    async SaveMatchRecordByUnoId(
        @Body() payload:Schema.API.MW.Match,
        @Param() { gameId, gameType, matchId, unoId }
    ):Promise<{ success: boolean }> {
        console.log(this.AccountDao)
        const { id:accountId } = await this.AccountDao.findByUnoId(unoId)
        if (!accountId) {
            throw new BadRequestException(`invalid unoId "${unoId}"`)
        }
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
        switch(`${gameId}/${gameType}`) {
            case 'mw/mp':
                await this.MwMpRecordDao.insert({ accountId, ...NormalizeMatch.MW.MP.Record(payload as Schema.API.MW.MP.Match)})
                break
            default: throw new BadRequestException(`unsupported game/mode "${gameId}"/"${gameType}"`)
        }
        return { success: true }
    }

    @Put('/:gameId/:gameType/:matchId/:platform/:username')
    async SaveMatchRecordByProfileId(
        @Body() payload:Schema.API.MW.Match,
        @Param() { gameId, gameType, matchId, platform, username }
    ):Promise<{ success: boolean }> {
        return { success: true }
    }

}
