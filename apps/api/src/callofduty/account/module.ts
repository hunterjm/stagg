import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from '../module.db'
import { CallOfDutyAccountService } from './services'
import { CallOfDutyAccountController } from './controller'
import { CallOfDuty } from '@stagg/db'

@Module({
  imports: [
    CallOfDutyDbModule,
    TypeOrmModule.forFeature([
      CallOfDuty.Account.Base.Repository,
      CallOfDuty.Account.Auth.Repository,
      CallOfDuty.Account.Profile.Repository
    ], 'callofduty'),
  ],
  exports: [CallOfDutyAccountService],
  providers: [CallOfDutyAccountService],
  controllers: [CallOfDutyAccountController],
})
export class CallOfDutyAccountModule {}
