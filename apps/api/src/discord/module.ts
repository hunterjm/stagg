import { Module } from '@nestjs/common'
import { DiscordController } from './controller'
import { DiscordService } from 'src/discord/services'
import { DiscordBotService } from 'src/discord/bot'
import { UserModule } from 'src/user/module'

@Module({
  imports: [UserModule],
  exports: [DiscordService, DiscordBotService],
  providers: [DiscordService, DiscordBotService],
  controllers: [DiscordController],
})

export class DiscordModule {}
