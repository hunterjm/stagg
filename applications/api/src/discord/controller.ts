import {
    Get,
    Res,
    Param,
    Controller,
    BadGatewayException,
    BadRequestException,
} from '@nestjs/common'
import { Route } from '@stagg/api'
import { DiscordService } from './services'
import { AccountService } from 'src/account/services'
import { signJwt } from 'src/jwt'
import { denormalizeAccount } from 'src/account/model'

@Controller('/discord')
export class DiscordController {
    constructor(
        private readonly acctService: AccountService,
        private readonly discordService: DiscordService,
    ) {}
    @Get('/health')
    async HealthCheck():Promise<string> {
        return 'ok'
    }
    @Get('/oauth/exchange/:oauthCode')
    async OAuthExchange(@Res() res, @Param() { oauthCode }):Promise<Route.Discord.OAuthExchange> {
        const accessToken = await this.discordService.exchangeOAuthCodeForAccessToken(oauthCode)
        if (!accessToken) {
            throw new BadRequestException('invalid oauth code')
        }
        try {
            const { id, tag, avatar } = await this.discordService.exchangeAccessTokenForAccount(accessToken)
            res.setHeader('Access-Control-Expose-Headers', 'X-Authorization-JWT, X-Discord-Provision-JWT')
            const responsePayload:Route.Discord.OAuthExchange = {
                account: null,
                accountProvision: null
            }
            const existing = await this.acctService.getByDiscordId(id)
            if (existing) {
                responsePayload.account = denormalizeAccount(existing)
                res.setHeader('X-Authorization-JWT', signJwt(responsePayload))
            } else {
                responsePayload.accountProvision = { id, tag, avatar }
                res.setHeader('X-Discord-Provision-JWT', signJwt(responsePayload))
            }
            res.send(responsePayload)
            return responsePayload
        } catch(e) {
            throw new BadGatewayException('access token exchange failure')
        }
    }
}