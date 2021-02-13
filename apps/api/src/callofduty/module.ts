import { Module } from '@nestjs/common'
import { CallOfDutyController } from './controller'
import { CallOfDutyMatchModule } from './match/module'
import { CallOfDutyAccountModule } from './account/module'
import { CallOfDutyAccountService } from './account/services'
import { CallOfDuty } from '@stagg/db'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    CallOfDutyMatchModule,
    CallOfDutyAccountModule,
    TypeOrmModule.forFeature([
      CallOfDuty.Account.Base.Repository,
      CallOfDuty.Account.Auth.Repository,
      CallOfDuty.Account.Profile.Repository
    ], 'callofduty'),
  ],
  exports: [CallOfDutyAccountService],
  providers: [CallOfDutyAccountService],
  controllers: [CallOfDutyController],
})
export class CallOfDutyModule { }
