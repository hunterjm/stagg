import { Route } from '@stagg/api'
import {
    Post,
    Body,
    Res,
    Get,
    Param,
    Query,
    Controller,
    BadRequestException,
} from '@nestjs/common'
import { AccountCredentialsDTO } from './dto'
import { CallOfDutyApiService, CallOfDutyDbService } from './services'
import { AccountService } from 'src/account/services'
import { signJwt } from 'src/jwt'
import { denormalizeAccount } from 'src/account/model'

@Controller('/callofduty')
export class CallOfDutyController {
    constructor(
        private readonly acctService: AccountService,
        private readonly codDbService: CallOfDutyDbService,
        private readonly codApiService: CallOfDutyApiService,
    ) {}

    @Post('/authorize')
    async ExchangeCredentials(@Res() res, @Body() { email, password }: AccountCredentialsDTO):Promise<Route.CallOfDuty.Authorization> {
        const tokens = await this.codApiService.authorizeCredentials(email, password)
        const { games, profiles: [ profile ] } = await this.codApiService.fetchIdentity(tokens)
        res.setHeader('Access-Control-Expose-Headers', 'X-Authorization-JWT, X-CallOfDuty-Provision-JWT')
        const responsePayload:Route.CallOfDuty.Authorization = {
            account: null,
            accountProvision: null,
            authorizationProvision: tokens
        }
        const existingAcct = await this.acctService.getByPlatformId(profile)
        if (existingAcct) {
            responsePayload.account = denormalizeAccount(existingAcct)
            res.setHeader('X-Authorization-JWT', signJwt(responsePayload))
        } else {
            const profiles = await this.codApiService.fetchAccounts(tokens, profile)
            responsePayload.accountProvision = { games, profiles }
            try {
                const { unoId } = await this.codApiService.fetchUnoId(tokens, profiles[0])
                responsePayload.accountProvision.unoId = unoId
            } catch(e) {}
            res.setHeader('X-CallOfDuty-Provision-JWT', signJwt(responsePayload))
        }
        res.send(responsePayload)
        return responsePayload
    }
    @Get('/:unoUsername/wz/barracks')
    async WzBarracksData(@Param() { unoUsername }, @Query() { limit, skip }) {
        const account = await this.acctService.getByPlatformId({ platform: 'uno', username: unoUsername })
        if (!account) {
            throw new BadRequestException('invalid uno username')
        }
        const formattedAcct = denormalizeAccount(account)
        const stats = await this.codDbService.getWzBarracksData(account.account_id, Number(limit || 0), Number(skip || 0), 'days')
        return { account:formattedAcct, stats }
    }
    
}
