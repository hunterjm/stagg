import * as Events from '@stagg/events'
import { Route } from '@stagg/api'
import {
    Req,
    Res,
    Post,
    Controller,
    UnauthorizedException,
} from '@nestjs/common'
import { signJwt, verifyJwt } from 'src/jwt'
import { AccountService } from './services'

@Controller('/account')
export class AccountController {
    constructor(
        private readonly acctService: AccountService,
    ) {}
    @Post('/register')
    async AccountRegistration(@Req() req, @Res() res):Promise<Route.Account.Registration> {
        const discordJwt = req.headers['x-discord-provision-jwt']
        const callofdutyJwt = req.headers['x-callofduty-provision-jwt']
        const discordAcct = verifyJwt<Route.Discord.OAuthExchange>(discordJwt)
        const callofdutyAcct = verifyJwt<Route.CallOfDuty.Authorization>(callofdutyJwt)
        if (!discordAcct || !callofdutyAcct) {
            throw new UnauthorizedException('authorization failure')
        }
        const { accountProvision:discord } = discordAcct
        const { accountProvision:callofduty, authorizationProvision:tokens } = callofdutyAcct
        const account = await this.acctService.createFromProvisions(discord, callofduty, tokens)
        Events.Account.Created.Trigger({ account })
        const responsePayload:Route.Account.Registration = { account: { id: account.account_id, discord, callofduty } }
        res.setHeader('Access-Control-Expose-Headers', 'X-Authorization-JWT')
        res.setHeader('X-Authorization-JWT', signJwt(responsePayload))
        res.send(responsePayload)
        return responsePayload
    }
}