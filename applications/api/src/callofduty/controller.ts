import { Route } from '@stagg/api'
import {
    Post,
    Body,
    Res,
    Controller,
} from '@nestjs/common'
import { AccountCredentialsDTO } from './dto'
import { CallOfDutyApiService } from './services'
import { AccountService } from 'src/account/services'
import { signJwt } from 'src/jwt'
import { denormalizeAccount } from 'src/account/model'

@Controller('/callofduty')
export class CallOfDutyController {
    constructor(
        private readonly acctService: AccountService,
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
    
}
