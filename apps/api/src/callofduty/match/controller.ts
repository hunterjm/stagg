import { Schema } from 'callofduty'
import {
    Controller,
    Get,
    Put,
    Patch,
    Query,
    Param,
    Body,
    BadRequestException,
} from '@nestjs/common'
import { CallOfDutyMatchService } from './services'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
// Can get rid of this by getting accountId from the jwt, it's already verified anyway


@Controller('callofduty/match')
export class CallOfDutyMatchController {
    constructor(
        private readonly AccountSvcs: CallOfDutyAccountService,
        private readonly MatchService: CallOfDutyMatchService,
    ) {}
    
    @Get('/history/:gameId/:gameType/user/:userId')
    async GetUserMatchHistory(@Param() { gameId, gameType, userId }, @Query() { limit, offset }) {
        const [account] = await this.AccountSvcs.findAllByUserId(userId)
        if (!account) {
            throw new BadRequestException('invalid user id')
        }
        return this.MatchService.getHistoryByAccountId(account.accountId, gameId, gameType, limit, offset)
    }
    
    @Get('/history/:gameId/:gameType/account/:accountId')
    async GetAccountMatchHistory(@Param() { gameId, gameType, accountId }) {
        return this.MatchService.getHistoryByAccountId(accountId, gameId, gameType)
    }

    @Put('/:gameId/:gameType/:matchId/events')
    async SaveMatchEvents(@Param() { gameId, gameType, matchId }):Promise<{ success: boolean }> {
        return { success: true }
    }

    @Put('/:gameId/:gameType/:matchId/:unoId')
    async SaveMatchRecordByUnoId(
        @Body() payload:Schema.Match,
        @Param() { gameId, gameType, matchId, unoId }
    ):Promise<{ success: boolean }> {
        const acct = await this.AccountSvcs.buildModelForUnoId(unoId)
        if (!acct) {
            throw new BadRequestException(`invalid unoId "${unoId}"`)
        }
        await this.MatchService.insertMatchRecord(acct.accountId, gameId, gameType, payload)
        return { success: true }
    }

    @Patch('/:gameId/:gameType/:matchId/:unoId')
    async UpdateMatchRecordByUnoId(
        @Body() payload:Schema.Match,
        @Param() { gameId, gameType, matchId, unoId }
    ):Promise<{ success: boolean }> {
        const acct = await this.AccountSvcs.buildModelForUnoId(unoId)
        if (!acct) {
            throw new BadRequestException(`invalid unoId "${unoId}"`)
        }
        await this.MatchService.updateMatchRecord(matchId, acct.accountId, gameId, gameType, payload)
        return { success: true }
    }

    @Put('/:gameId/:gameType/:matchId/:platform/:username')
    async SaveMatchRecordByProfileId(
        @Body() payload:Schema.Match,
        @Param() { gameId, gameType, matchId, platform, username }
    ):Promise<{ success: boolean }> {
        const acct = await this.AccountSvcs.buildModelForProfile(username, platform)
        if (!acct) {
            throw new BadRequestException(`invalid profile "${platform}/${username}}"`)
        }
        await this.MatchService.insertMatchRecord(acct.accountId, gameId, gameType, payload)
        return { success: true }
    }

    @Patch('/:gameId/:gameType/:matchId/:platform/:username')
    async UpdateMatchRecordByProfileId(
        @Body() payload:Schema.Match,
        @Param() { gameId, gameType, matchId, platform, username }
    ):Promise<{ success: boolean }> {
        const acct = await this.AccountSvcs.buildModelForProfile(username, platform)
        if (!acct) {
            throw new BadRequestException(`invalid profile "${platform}/${username}}"`)
        }
        await this.MatchService.updateMatchRecord(matchId, acct.accountId, gameId, gameType, payload)
        return { success: true }
    }

}
