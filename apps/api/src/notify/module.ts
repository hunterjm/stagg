import { Module } from '@nestjs/common'
import { NotificationController } from './controller'
import { DiscordModule } from 'src/discord/module'
import { UserModule } from 'src/user/module'

@Module({
  providers: [],
  controllers: [
    NotificationController
  ],
  imports: [DiscordModule, UserModule],
})

export class NotificationModule {}
