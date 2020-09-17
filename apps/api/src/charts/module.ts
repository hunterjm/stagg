import { Module } from '@nestjs/common'
import { ChartsController } from './controller'

@Module({
  imports: [],
  controllers: [ChartsController],
})
export class ChartModule {}
