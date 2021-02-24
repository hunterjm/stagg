import { Module } from '@nestjs/common'
import { Account, CallOfDuty } from '@stagg/db'
import { CallOfDutyDB, CallOfDutyAPI } from './services'
import { CallOfDutyController } from './controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountModule } from 'src/account/module'
import { DbModule } from '../module.db'

@Module({
  imports: [
    DbModule,
    AccountModule,
    TypeOrmModule.forFeature([
      Account.Repository,
      CallOfDuty.MW.Match.Repository,
      CallOfDuty.WZ.Match.Repository,
      CallOfDuty.MW.Profile.Repository,
      CallOfDuty.MW.Profile.Mode.Repository,
      CallOfDuty.WZ.Profile.Mode.Repository,
      CallOfDuty.MW.Profile.Weapon.Repository,
      CallOfDuty.MW.Profile.Equipment.Repository,
    ], 'stagg'),
  ],
  exports: [],
  providers: [CallOfDutyDB, CallOfDutyAPI],
  controllers: [
    CallOfDutyController,
  ],
})

export class CallOfDutyModule {}
