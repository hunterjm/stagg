import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { Account, AccountDAO } from 'src/callofduty/account/entity'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { CallOfDutyAccountController } from 'src/callofduty/account/controller'

@Module({
  imports: [
    CallOfDutyDbModule,
    TypeOrmModule.forFeature([Account], 'callofduty'),
  ],
  exports: [CallOfDutyAccountService, AccountDAO],
  providers: [CallOfDutyAccountService, AccountDAO],
  controllers: [CallOfDutyAccountController],
})
export class CallOfDutyAccountModule {}
