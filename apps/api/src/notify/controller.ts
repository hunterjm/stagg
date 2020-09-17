import { IsNotEmpty } from 'class-validator'
import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException
} from '@nestjs/common'
import { UserService } from 'src/user/services'
import { DiscordService } from 'src/discord/services'

export class NotificationPayload {
    @IsNotEmpty()
    channels: ('email' | 'web' | 'mobile' | 'discord')[]
    @IsNotEmpty()
    title: string
    @IsNotEmpty()
    payload: {
      email?: any
      web?: any
      mobile?: any
      discord?: any
    }
}

@Controller('/notify')
export class NotificationController {
    constructor(
        private readonly userService: UserService,
        private readonly discordService: DiscordService,
    ) {}
    @Post('/:userId')
    async NotifyByUserId(@Param() { userId }, @Body() body:NotificationPayload):Promise<string> {
        const user = await this.userService.fetchById(userId)
        if (!user) {
            throw new BadRequestException('user not found')
        }
        if (body.channels.includes('discord') && user.discord?.id) {
            this.discordService.sendToUser(user.discord.id, [
                `:bell: **${body.title}**`,
                body.payload.discord
            ])
        }
        return 'ok'
    }
    @Post('/:gameId/:accountId')
    async NotifyByGameAccountId(@Param() { gameId, accountId }, @Body() body:NotificationPayload):Promise<string> {
        const user = await this.userService.fetchByGameAccountId(gameId, accountId)
        if (!user) {
            throw new BadRequestException('user not found')
        }
        if (body.channels.includes('discord') && user.discord?.id) {
            this.discordService.sendToUser(user.discord.id, [
                `:bell: **${body.title}**`,
                body.payload.discord
            ])
        }
        return 'ok'
    }
}