import { Module } from '@nestjs/common'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { CallOfDutyProfileController } from 'src/callofduty/profile/controller'

@Module({
  imports: [
    CallOfDutyDbModule,
  ],
  exports: [],
  providers: [],
  controllers: [CallOfDutyProfileController],
})
export class CallOfDutyProfileModule {}
