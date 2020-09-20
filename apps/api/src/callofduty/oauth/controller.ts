import { API } from '@stagg/callofduty'
import { Controller, Res, Post, Body, UnauthorizedException } from '@nestjs/common'
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
                account = await this.authService.insertAccount(body.email, tokens)
            }
            const jwt = await this.authService.accountJwt(account)
            return res.status(statusCode).send({ jwt })
        } catch(e) {
            throw new UnauthorizedException(e)
        }
    }
}
