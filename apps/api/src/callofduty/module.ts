import { Module } from '@nestjs/common'
import { CallOfDutyOAuthModule } from './oauth/module'
import { ModernWarfareModule } from './mw/module'
import { CallOfDutyMatchModule } from './match/module'
import { CallOfDutyAccountModule } from './account/module'

@Module({
  imports: [
    ModernWarfareModule,
    CallOfDutyOAuthModule,
    CallOfDutyMatchModule,
    CallOfDutyAccountModule,
  ],
  providers: [],
  controllers: [],
})
export class CallOfDutyModule {}
