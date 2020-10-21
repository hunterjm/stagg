import { Module } from '@nestjs/common'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { MwDiscordService } from 'src/callofduty/mw/discord/services'

@Module({
  imports: [CallOfDutyAccountModule],
  exports: [MwDiscordService],
  providers: [MwDiscordService],
  controllers: [],
})
export class MwDiscordModule {}
