import { Module } from '@nestjs/common'
import { CallOfDutyController } from './controller'

@Module({
  imports: [],
  providers: [],
  controllers: [CallOfDutyController],
})
export class CallOfDutyModule {}
