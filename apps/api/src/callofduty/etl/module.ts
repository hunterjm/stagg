import { Module } from '@nestjs/common'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDutyEtlService } from 'src/callofduty/etl/services'
import { CallOfDutyEtlController } from 'src/callofduty/etl/controller'

@Module({
  imports: [
    CallOfDutyDbModule,
    CallOfDutyAccountModule
  ],
  exports: [CallOfDutyEtlService],
  providers: [CallOfDutyEtlService],
  controllers: [CallOfDutyEtlController],
})
export class CallOfDutyEtlModule {}
