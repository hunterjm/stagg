import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from '../module.db'
import { CallOfDutyAccountService } from './services'
import { CallOfDutyAccountController } from './controller'
import {
  Account,
  AccountDAO,
  AccountAuth,
  AccountAuthDAO,
  AccountProfile,
  AccountProfileDAO,
} from './entity'

@Module({
  imports: [
    CallOfDutyDbModule,
    TypeOrmModule.forFeature([Account, AccountAuth, AccountProfile], 'callofduty'),
  ],
  exports: [CallOfDutyAccountService, AccountDAO, AccountAuthDAO, AccountProfileDAO],
  providers: [CallOfDutyAccountService, AccountDAO, AccountAuthDAO, AccountProfileDAO],
  controllers: [CallOfDutyAccountController],
})
export class CallOfDutyAccountModule {}
