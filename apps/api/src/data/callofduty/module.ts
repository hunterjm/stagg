import { Module } from '@nestjs/common'
import { CallOfDutyDataService } from './services'
import { CallOfDutyDataController } from './controller'

@Module({
  imports: [],
  providers: [CallOfDutyDataService],
  controllers: [CallOfDutyDataController],
})
export class CallOfDutyDataModule {}
