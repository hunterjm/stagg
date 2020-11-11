import * as JWT from 'jsonwebtoken'
import { Controller, Get, Param } from '@nestjs/common'
import { DiscordService } from 'src/discord/services'
import { JWT_SECRET } from 'src/config'

@Controller('/discord')
export class DiscordController {
    constructor(
        private readonly discordService: DiscordService,
    ) {}
    @Get('/health')
    async HealthCheck():Promise<string> {
        return 'ok'
    }
    @Get('/oauth/exchange/:accessToken')
    async ExchangeAccessToken(@Param() { accessToken }) {
        const discordInfo = await this.discordService.exchangeAccessToken(accessToken)
        const acct = await this.discordService.findById(discordInfo.id)
        const payload = acct ? {...discordInfo, userId: acct.userId} : discordInfo
        return { jwt: JWT.sign(payload, JWT_SECRET) }
    }
}