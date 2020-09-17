import { Module } from '@nestjs/common'
import { CallOfDutyOAuthModule } from './oauth/module'
import { ModernWarfareModule } from './mw/module'

@Module({
  imports: [
    ModernWarfareModule,
    CallOfDutyOAuthModule,
  ],
  exports: [
    ModernWarfareModule,
    CallOfDutyOAuthModule,
  ],
  providers: [],
  controllers: [],
})
export class CallOfDutyModule {}
