import { Module } from '@nestjs/common'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDutyEtlController } from 'src/callofduty/etl/controller'

@Module({
  imports: [
    CallOfDutyDbModule,
    CallOfDutyAccountModule
  ],
  exports: [],
  providers: [],
  controllers: [CallOfDutyEtlController],
})
export class CallOfDutyEtlModule {}
