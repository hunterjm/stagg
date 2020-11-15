import { Module } from '@nestjs/common'
import { CallOfDutyController } from './controller'
import { CallOfDutyMatchModule } from './match/module'
import { CallOfDutyAccountModule } from './account/module'
import { CallOfDutyProfileModule } from './profile/module'
import { CallOfDutyFriendsModule } from './friends/module'

@Module({
  imports: [
    CallOfDutyMatchModule,
    CallOfDutyAccountModule,
    CallOfDutyProfileModule,
    CallOfDutyFriendsModule,
  ],
  providers: [],
  controllers: [CallOfDutyController],
})
export class CallOfDutyModule {}
