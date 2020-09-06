import { Module } from '@nestjs/common'
import { CallOfDutyDataModule } from './callofduty/module'

@Module({
  imports: [CallOfDutyDataModule],
})
export class DataModule {}
