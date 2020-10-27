import { Controller, Post, Param } from '@nestjs/common'
import { UserService } from 'src/user/services'
import { DiscordService } from 'src/discord/services'

@Controller('/user')
export class UserController {
    constructor(
    ) {}
    @Post('/:userId')
    async Create(@Param() { userId }):Promise<string> {
        return 'ok'
    }
}