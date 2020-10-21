import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/module'
import { MailModule } from 'src/mail/module'
import { DiscordBotService } from 'src/discord/bot/services'
import { MwDiscordModule } from 'src/callofduty/mw/discord/module'
import { DiscordBotDispatchService } from 'src/discord/bot/services.dispatch'
import { DiscordBotHandlerService } from 'src/discord/bot/services.handlers'

@Module({
  imports: [
    MailModule,
    UserModule,
    MwDiscordModule
  ],
  exports: [
    DiscordBotDispatchService
  ],
  providers: [
    DiscordBotService,
    DiscordBotHandlerService,
    DiscordBotDispatchService,
  ],
  controllers: [],
})

export class DiscordBotModule {}
