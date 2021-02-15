import { Module } from '@nestjs/common'
import { Account, CallOfDuty } from '@stagg/db'
import { CallOfDutyApiService } from './services'
import { CallOfDutyController } from './controller'
import { CallOfDutyDbService } from './db/services'
import { CallOfDutyDataController } from './db/controller'
import { CallOfDutyPassthroughAPI } from './api/controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountModule } from 'src/account/module'
import { DbModule } from '../module.db'

@Module({
  imports: [
    DbModule,
    AccountModule,
    TypeOrmModule.forFeature([
      Account.Repository,
      Account.Payment.Repository,
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
  providers: [CallOfDutyApiService, CallOfDutyDbService],
  controllers: [
    CallOfDutyController,
    CallOfDutyPassthroughAPI,
    CallOfDutyDataController,
  ],
})

export class CallOfDutyModule {}
