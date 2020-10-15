import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CallOfDutyDbModule } from 'src/callofduty/module.db'
import { Account, AccountDAO } from 'src/callofduty/account/entity'
import { CallOfDutyFriendsController } from 'src/callofduty/friends/controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
    ]),
    CallOfDutyDbModule
  ],
  exports: [],
  providers: [AccountDAO],
  controllers: [CallOfDutyFriendsController],
})
export class CallOfDutyFriendsModule {}
