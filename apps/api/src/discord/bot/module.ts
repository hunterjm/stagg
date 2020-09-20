import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/module'
import { DiscordBotRelayService } from 'src/discord/bot/services'
import { DiscordBotRelayDispatchService } from 'src/discord/bot/services.dispatch'

@Module({
  imports: [UserModule],
  exports: [],
  providers: [DiscordBotRelayService, DiscordBotRelayDispatchService],
  controllers: [],
})

export class DiscordBotModule {}
