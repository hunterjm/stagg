import { Controller, Post, Body } from '@nestjs/common'
import { CallOfDutyOAuthCredentialsDTO } from './dto'
import { CallOfDutyOAuthService } from './services'

@Controller('oauth')
export class CallOfDutyOAuthController {
    constructor(private readonly service: CallOfDutyOAuthService) {}

    @Post('cred/callofduty')
    async CallOfDutyCredentialLogin(@Body() dto: CallOfDutyOAuthCredentialsDTO):Promise<CallOfDutyOAuthCredentialsDTO> {
        // await this.service.CallOfDuty.SignIn(dto.email, dto.password)
        return {
            ...dto
        }
    }
}
