import { Controller, Post, Body } from '@nestjs/common';
import { OAuthCredentialsDTO } from './oauth.dto'
import { OAuthService } from './oauth.services'

@Controller('oauth')
export class OAuthController {
    constructor(private readonly service: OAuthService) {}

    @Post('cred/callofduty')
    async CallOfDutyCredentialLogin(@Body() dto: OAuthCredentialsDTO):Promise<OAuthCredentialsDTO> {
        // await this.service.CallOfDuty.SignIn(dto.email, dto.password)
        return {
            ...dto
        }
    }
}
