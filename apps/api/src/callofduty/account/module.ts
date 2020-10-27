import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { Account, AccountDAO, AccountAuth, AccountAuthDAO } from 'src/callofduty/account/entity'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { CallOfDutyAccountController } from 'src/callofduty/account/controller'

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
