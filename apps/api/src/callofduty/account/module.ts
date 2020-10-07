import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { AccountDAO, AccountLookupDAO } from 'src/callofduty/account/dao'
import { Account, AccountLookup } from 'src/callofduty/account/entity'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { CallOfDutyAccountController } from 'src/callofduty/account/controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      AccountLookup
    ]),
    CallOfDutyDbModule
  ],
  exports: [CallOfDutyAccountService, AccountDAO, AccountLookupDAO],
  providers: [CallOfDutyAccountService, AccountDAO, AccountLookupDAO],
  controllers: [CallOfDutyAccountController],
})
export class CallOfDutyAccountModule {}
