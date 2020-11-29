import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from '../module.db'
import { CallOfDutyMatchService } from './services'
import { CallOfDutyMatchController } from './controller'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDuty } from '@stagg/db'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CallOfDuty.Match.MW.MP.Detail.Repository,
      CallOfDuty.Match.MW.MP.Stats.Repository,
      CallOfDuty.Match.MW.MP.Killstreak.Repository,
      CallOfDuty.Match.MW.MP.Loadout.Repository,
      CallOfDuty.Match.MW.MP.Objective.Repository,
      CallOfDuty.Match.MW.MP.Weapon.Repository,
      CallOfDuty.Match.MW.WZ.Detail.Repository,
      CallOfDuty.Match.MW.WZ.Stats.Repository,
      CallOfDuty.Match.MW.WZ.Loadout.Repository,
      CallOfDuty.Match.MW.WZ.Objective.Repository
    ], 'callofduty'),
    CallOfDutyDbModule,
    forwardRef(() => CallOfDutyAccountModule),
  ],
  exports: [CallOfDutyMatchService],
  providers: [CallOfDutyMatchService],
  controllers: [CallOfDutyMatchController],
})
export class CallOfDutyMatchModule {}
