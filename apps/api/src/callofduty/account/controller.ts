import { Schema } from '@stagg/callofduty'
import { Controller, Get, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { Account } from 'src/callofduty/account/schemas'

@Controller('callofduty/profile')
export class CallOfDutyAccountController {
    constructor(private readonly playerService: CallOfDutyAccountService) {}

    @Get('/diff/account/:accountId')
    async GetProfileDiffByAccountId(@Param() { accountId }):Promise<{ account?: Partial<Account>, profile: any }> {
        const acct = await this.playerService.getAccountById(accountId)
        if (!acct) {
            throw new NotFoundException('user does not exist')
        }
        const [platform] = Object.keys(acct.profiles) as Schema.API.Platform[]
        const [username] = Object.values(acct.profiles)
        return this.playerService.getProfileDiff(platform, username)
    }

    @Get('/diff/:platform/:username')
    async GetProfileDiffByPlatformUsername(@Param() { platform, username }):Promise<{ account?: Partial<Account>, profile: any }> {
        return this.playerService.getProfileDiff(platform, username)
    }

    // @Get('/diff/:game/:gameType/:platform/:username')
    // async GetProfileDiffByPlatformUsername(@Param() { game, gameType, platform, username }):Promise<{ account?: Partial<Account>, profile: any }> {
    //     return this.playerService.getProfileDiff(game, gameType, platform, username)
    // }
}
