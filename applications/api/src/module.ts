import { Module } from '@nestjs/common'
import { RootController } from './controller'
import { AccountModule } from './account/module'
import { DiscordModule } from './discord/module'
import { CallOfDutyModule } from './callofduty/module'
import { BotModule } from './bot/module'
import { EventsModule } from './events/module'

@Module({
  controllers: [RootController],
  imports: [
    BotModule,
    EventsModule,
    AccountModule,
    DiscordModule,
    CallOfDutyModule,
  ],
})
export class RootModule {}
