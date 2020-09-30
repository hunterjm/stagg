import { API } from '@stagg/callofduty'
import { Controller, Res, Post, Body, UnauthorizedException, BadGatewayException } from '@nestjs/common'
import { CallOfDutyOAuthCredentialsDTO } from './dto'
import { CallOfDutyOAuthService } from './services'

@Controller('callofduty/oauth')
export class CallOfDutyOAuthController {
    constructor(private readonly authService: CallOfDutyOAuthService) {}

    @Post('credentials')
    async CredentialLogin(@Res() res, @Body() body: CallOfDutyOAuthCredentialsDTO):Promise<{ jwt:string }> {
        const CallOfDutyAPI = new API()
        try {
            const tokens = await CallOfDutyAPI.Login(body.email, body.password)
            let account = await this.authService.accountByEmail(body.email)
            let statusCode = 200
            if (account) {
                await this.authService.updateAccount(account, tokens)
            } else {
                statusCode = 201
                CallOfDutyAPI.Tokens(tokens)
                try {
                    const { titleIdentities } = await CallOfDutyAPI.Identity()
                    const games = []
                    const profiles = {}
                    for(const identity of titleIdentities) {
                        profiles[identity.platform] = identity.username
                        if (!games.includes(identity.title)) {
                            games.push(identity.title)
                        }
                    }
                    account = await this.authService.insertAccount(body.email, tokens, games, profiles)
                } catch(e) {
                    throw new BadGatewayException('External integration failure on CallOfDuty.API.Identity')
                }
            }
            const jwt = await this.authService.accountJwt(account)
            return res.status(statusCode).send({ jwt })
        } catch(e) {
            throw new UnauthorizedException(e)
        }
    }
}
