import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { CallOfDutyProfileController } from 'src/callofduty/profile/controller'

@Module({
  imports: [
    CallOfDutyDbModule,
    CallOfDutyAccountModule
  ],
  exports: [],
  providers: [],
  controllers: [CallOfDutyProfileController],
})
export class CallOfDutyProfileModule {}
