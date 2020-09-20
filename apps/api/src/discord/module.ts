import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/module'
import { DiscordService } from 'src/discord/services'
import { DiscordBotModule } from 'src/discord/bot/module'
import { DiscordController } from 'src/discord/controller'

@Module({
  imports: [UserModule, DiscordBotModule],
  exports: [DiscordService],
  providers: [DiscordService],
  controllers: [DiscordController],
})

export class DiscordModule {}
