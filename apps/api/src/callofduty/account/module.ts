import { Module } from '@nestjs/common'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { CallOfDutyAccountController } from 'src/callofduty/account/controller'

@Module({
  imports: [],
  exports: [CallOfDutyAccountService],
  providers: [CallOfDutyAccountService],
  controllers: [CallOfDutyAccountController],
})
export class CallOfDutyAccountModule {}
