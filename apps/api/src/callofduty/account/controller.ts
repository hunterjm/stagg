import { Schema } from '@stagg/callofduty'
import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    Param,
    NotFoundException,
    InternalServerErrorException
} from '@nestjs/common'
import { AccountLookupDAO } from 'src/callofduty/account/dao'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { Account } from 'src/callofduty/account/schemas'

@Controller('callofduty/account')
export class CallOfDutyAccountController {
    constructor(
        private readonly acctSrvc: CallOfDutyAccountService,
        private readonly lookupDAO: AccountLookupDAO,
    ) {}

    @Put('/:unoId/:gameId/:platform/:username')
    async AddGameProfile(@Param() { unoId, gameId, platform, username }):Promise<{ success: boolean }> {
        await this.lookupDAO.addGame(unoId, gameId)
        await this.lookupDAO.addProfile(unoId, { platform, username })
        return { success: true }
    }

    // @Put('/:unoId/games/:gameId')
    // async AddAccountGame(@Param() { unoId, gameId }):Promise<{ success: boolean }> {
    //     await this.acctSrvc.addLookupGame(unoId, gameId)
    //     return { success: true }
    // }

    // @Put('/:unoId/emails/:email')
    // async AddAccountEmail(@Param() { unoId, email }):Promise<string[]> {
    //     return this.acctSrvc.accountByUnoId(unoId)
    // }

    // @Get('/:unoId/profiles')
    // async GetAccountProfiles(@Param() { unoId, platform }):Promise<string[]> {
    //     return this.acctSrvc.accountByUnoId(unoId)
    // }

    // @Get('/:unoId/profiles/:platform')
    // async GetAccountPlatformProfiles(@Param() { unoId, platform }):Promise<string[]> {
    //     return this.acctSrvc.accountByUnoId(unoId)
    // }

    // @Put('/:unoId/profiles/:platform/:username')
    // async AddAccountProfile(@Param() { unoId, platform, username }):Promise<string[]> {
    //     return this.acctSrvc.accountByUnoId(unoId)
    // }
    
    // @Get('/:unoId')
    // async GetUnoId(@Param() { unoId }):Promise<string[]> {
    //     return this.acctSrvc.accountByUnoId(unoId)
    // }

    @Get('/diff/account/:accountId')
    async GetProfileDiffByAccountId(@Param() { accountId }):Promise<{ account?: Partial<Account>, profile: any }> {
        const acct = await this.acctSrvc.getAccountById(accountId)
        if (!acct) {
            throw new NotFoundException('user does not exist')
        }
        const [platform] = Object.keys(acct.profiles) as Schema.API.Platform[]
        const [username] = Object.values(acct.profiles)
        return this.acctSrvc.getProfileDiff(platform, username)
    }

    @Get('/diff/:platform/:username')
    async GetProfileDiffByPlatformUsername(@Param() { platform, username }):Promise<{ account?: Partial<Account>, profile: any }> {
        return this.acctSrvc.getProfileDiff(platform, username)
    }

    // @Get('/diff/:game/:gameType/:platform/:username')
    // async GetProfileDiffByPlatformUsername(@Param() { game, gameType, platform, username }):Promise<{ account?: Partial<Account>, profile: any }> {
    //     return this.acctSrvc.getProfileDiff(game, gameType, platform, username)
    // }
}
