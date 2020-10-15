import { Module } from '@nestjs/common'
import { CallOfDutyOAuthModule } from './oauth/module'
import { ModernWarfareModule } from './mw/module'
import { CallOfDutyMatchModule } from './match/module'
import { CallOfDutyAccountModule } from './account/module'
import { CallOfDutyProfileModule } from './profile/module'
import { CallOfDutyFriendsModule } from './friends/module'

@Module({
  imports: [
    ModernWarfareModule,
    CallOfDutyMatchModule,
    CallOfDutyOAuthModule,
    CallOfDutyAccountModule,
    CallOfDutyProfileModule,
    CallOfDutyFriendsModule,
  ],
  providers: [],
  controllers: [],
})
export class CallOfDutyModule {}
