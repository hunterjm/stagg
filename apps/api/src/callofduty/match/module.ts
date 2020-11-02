import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from '../module.db'
import { CallOfDutyMatchService } from './services'
import { CallOfDutyMatchController } from './controller'
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
    forwardRef(() => CallOfDutyAccountModule),
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
