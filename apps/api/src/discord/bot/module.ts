import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/module'
import { MailModule } from 'src/mail/module'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { DiscordBotService } from 'src/discord/bot/services'
import { DiscordBotDispatchService } from 'src/discord/bot/services.dispatch'
import { DiscordBotHandlerService } from 'src/discord/bot/services.handlers'
import { DiscordBotCallOfDutyHandlerService } from 'src/discord/bot/services.h.callofduty'

@Module({
  imports: [MailModule, UserModule, CallOfDutyAccountModule],
  exports: [DiscordBotDispatchService],
  providers: [
    DiscordBotService,
    DiscordBotHandlerService,
    DiscordBotDispatchService,
    DiscordBotCallOfDutyHandlerService,
  ],
  controllers: [],
})

export class DiscordBotModule {}
