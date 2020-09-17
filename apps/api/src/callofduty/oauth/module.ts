import { Module } from '@nestjs/common'
import { CallOfDutyOAuthService } from './services'
import { CallOfDutyOAuthController } from './controller'

@Module({
  imports: [],
  providers: [CallOfDutyOAuthService],
  controllers: [CallOfDutyOAuthController],
})
export class CallOfDutyOAuthModule {}
