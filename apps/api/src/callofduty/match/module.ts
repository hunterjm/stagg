import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { CallOfDutyMatchService } from 'src/callofduty/match/services'
import { CallOfDutyMatchController } from 'src/callofduty/match/controller'
import * as Match from 'src/callofduty/match/entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match.MW.MP.Record,
      Match.MW.MP.Details,
      Match.MW.WZ.Record,
      Match.MW.WZ.Details,
    ]),
    CallOfDutyDbModule
  ],
  exports: [],
  providers: [CallOfDutyMatchService],
  controllers: [CallOfDutyMatchController],
})
export class CallOfDutyMatchModule {}
