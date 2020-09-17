import { Module } from '@nestjs/common'
import { NotificationController } from './controller'
import { DiscordService } from 'src/discord/services'
import { UserService } from 'src/user/services'

@Module({
  providers: [
    UserService,
    DiscordService
  ],
  controllers: [
    NotificationController
  ],
  imports: [],
})

export class NotificationModule {}
