import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from '../module.db'
import { CallOfDutyMatchService } from './services'
import { CallOfDutyMatchController } from './controller'
import {
  MwMpMatchDetails,
  MwMpMatchDetailsDAO,
  MwMpMatchStats,
  MwMpMatchStatsDAO,
  MwMpMatchKillstreak,
  MwMpMatchKillstreakDAO,
  MwMpMatchLoadout,
  MwMpMatchLoadoutDAO,
  MwMpMatchObjective,
  MwMpMatchObjectiveDAO,
  MwMpMatchWeapon,
  MwMpMatchWeaponDAO,
  MwWzMatchDetails,
  MwWzMatchDetailsDAO,
  MwWzMatchStats,
  MwWzMatchStatsDAO,
  MwWzMatchLoadout,
  MwWzMatchLoadoutDAO,
  MwWzMatchObjective,
  MwWzMatchObjectiveDAO,
} from 'src/callofduty/match/entity'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MwMpMatchDetails,
      MwMpMatchStats,
      MwMpMatchKillstreak,
      MwMpMatchLoadout,
      MwMpMatchObjective,
      MwMpMatchWeapon,
      MwWzMatchDetails,
      MwWzMatchStats,
      MwWzMatchLoadout,
      MwWzMatchObjective,
    ], 'callofduty'),
    CallOfDutyDbModule,
    forwardRef(() => CallOfDutyAccountModule),
  ],
  exports: [],
  providers: [
    CallOfDutyMatchService,
    MwMpMatchDetailsDAO,
    MwMpMatchStatsDAO,
    MwMpMatchKillstreakDAO,
    MwMpMatchLoadoutDAO,
    MwMpMatchObjectiveDAO,
    MwMpMatchWeaponDAO,
    MwWzMatchDetailsDAO,
    MwWzMatchStatsDAO,
    MwWzMatchLoadoutDAO,
    MwWzMatchObjectiveDAO,
  ],
  controllers: [CallOfDutyMatchController],
})
export class CallOfDutyMatchModule {}
