import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { CallOfDutyMatchService } from 'src/callofduty/match/services'
import { CallOfDutyMatchController } from 'src/callofduty/match/controller'
import {
  MwMpMatchRecord,
  MwWzMatchRecord,
  MwMpMatchDetails,
  MwWzMatchDetails,
  MwMpMatchRecordDAO,
  MwWzMatchRecordDAO,
  MwMpMatchDetailsDAO,
  MwWzMatchDetailsDAO,
} from 'src/callofduty/match/entity'
import { Account } from 'src/callofduty/account/entity'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MwMpMatchRecord,
      MwWzMatchRecord,
      MwMpMatchDetails,
      MwWzMatchDetails,
    ], 'callofduty'),
    CallOfDutyDbModule,
    CallOfDutyAccountModule,
  ],
  exports: [],
  providers: [
    CallOfDutyMatchService,
    MwMpMatchRecordDAO,
    MwWzMatchRecordDAO,
    MwMpMatchDetailsDAO,
    MwWzMatchDetailsDAO,
  ],
  controllers: [CallOfDutyMatchController],
})
export class CallOfDutyMatchModule {}
