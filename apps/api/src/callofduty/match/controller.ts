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
import { CallOfDutyMatchService } from 'src/callofduty/match/services'
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
        private readonly MatchService: CallOfDutyMatchService,
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
        const { accountId } = await this.AccountDao.findByUnoId(unoId)
        if (!accountId) {
            throw new BadRequestException(`invalid unoId "${unoId}"`)
        }
        await this.MatchService.insertMatchRecord(accountId, gameId, gameType, payload)
        return { success: true }
    }

    @Patch('/:gameId/:gameType/:matchId/:unoId')
    async UpdateMatchRecordByUnoId(
        @Body() payload:Schema.API.MW.Match,
        @Param() { gameId, gameType, matchId, unoId }
    ):Promise<{ success: boolean }> {
        const { accountId } = await this.AccountDao.findByUnoId(unoId)
        if (!accountId) {
            throw new BadRequestException(`invalid unoId "${unoId}"`)
        }
        await this.MatchService.updateMatchRecord(matchId, accountId, gameId, gameType, payload)
        return { success: true }
    }

    @Put('/:gameId/:gameType/:matchId/:platform/:username')
    async SaveMatchRecordByProfileId(
        @Body() payload:Schema.API.MW.Match,
        @Param() { gameId, gameType, matchId, platform, username }
    ):Promise<{ success: boolean }> {
        const { accountId } = await this.AccountDao.findByProfile(username, platform)
        if (!accountId) {
            throw new BadRequestException(`invalid profile "${platform}/${username}}"`)
        }
        await this.MatchService.insertMatchRecord(accountId, gameId, gameType, payload)
        return { success: true }
    }

    @Patch('/:gameId/:gameType/:matchId/:platform/:username')
    async UpdateMatchRecordByProfileId(
        @Body() payload:Schema.API.MW.Match,
        @Param() { gameId, gameType, matchId, platform, username }
    ):Promise<{ success: boolean }> {
        const { accountId } = await this.AccountDao.findByProfile(username, platform)
        if (!accountId) {
            throw new BadRequestException(`invalid profile "${platform}/${username}}"`)
        }
        await this.MatchService.updateMatchRecord(matchId, accountId, gameId, gameType, payload)
        return { success: true }
    }

}
