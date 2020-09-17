import { Controller, Post, Body } from '@nestjs/common'
import { CallOfDutyOAuthCredentialsDTO } from './dto'
import { CallOfDutyOAuthService } from './services'

@Controller('callofduty/oauth')
export class CallOfDutyOAuthController {
    constructor(private readonly service: CallOfDutyOAuthService) {}

    @Post('credentials')
    async CredentialLogin(@Body() dto: CallOfDutyOAuthCredentialsDTO):Promise<string> {
        const jwt = await this.service.SignIn(dto.email, dto.password)
        return jwt
    }
}
