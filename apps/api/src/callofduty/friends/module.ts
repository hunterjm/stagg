import { Module } from '@nestjs/common'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDutyFriendsController } from 'src/callofduty/friends/controller'

@Module({
  imports: [
    CallOfDutyAccountModule,
  ],
  exports: [],
  providers: [],
  controllers: [CallOfDutyFriendsController],
})
export class CallOfDutyFriendsModule {}
