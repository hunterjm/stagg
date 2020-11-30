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
    async GetAccountMatchHistory(@Param() { gameId, gameType, accountId }, @Query() { limit, offset }) {
        return this.MatchService.getHistoryByAccountId(accountId, gameId, gameType, limit, offset)
    }
    
    @Get('/history/:gameId/:gameType/:platform/:username')
    async GetProfileMatchHistory(@Param() { gameId, gameType, platform, username }, @Query() { limit, offset }) {
        const { accountId } = await this.AccountSvcs.buildModelForProfile(username, platform)
        return this.MatchService.getHistoryByAccountId(accountId, gameId, gameType, limit, offset)
    }
}
