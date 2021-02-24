import { Module } from '@nestjs/common'
import { RootController } from './controller'
import { AccountModule } from './account/module'
import { DiscordModule } from './discord/module'
import { CallOfDutyModule } from './callofduty/module'
import { BotModule } from './bot/module'

@Module({
  controllers: [RootController],
  imports: [
    BotModule,
    AccountModule,
    DiscordModule,
    CallOfDutyModule,
  ],
})
export class RootModule {}
