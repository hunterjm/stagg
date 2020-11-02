import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from '../module.db'
import { CallOfDutyAccountService } from './services'
import { CallOfDutyAccountController } from './controller'
import { Account, AccountDAO, AccountAuth, AccountAuthDAO } from './entity'

@Module({
  imports: [
    CallOfDutyDbModule,
    TypeOrmModule.forFeature([Account, AccountAuth], 'callofduty'),
  ],
  exports: [CallOfDutyAccountService, AccountDAO, AccountAuthDAO],
  providers: [CallOfDutyAccountService, AccountDAO, AccountAuthDAO],
  controllers: [CallOfDutyAccountController],
})
export class CallOfDutyAccountModule {}
