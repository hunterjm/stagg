import { Controller, Put, Param } from '@nestjs/common'
import { UserService } from 'src/user/services'
import { DiscordService } from 'src/discord/services'

@Controller('/user')
export class UserController {
    constructor(
    ) {}
    @Put('/:userId')
    async HealthCheck(@Param() { userId }):Promise<string> {
        return 'ok'
    }
}