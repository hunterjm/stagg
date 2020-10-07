import { Module } from '@nestjs/common'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDutyOAuthService } from 'src/callofduty/oauth/services'
import { CallOfDutyOAuthController } from 'src/callofduty/oauth/controller'

@Module({
  imports: [CallOfDutyAccountModule],
  providers: [CallOfDutyOAuthService],
  controllers: [CallOfDutyOAuthController],
})
export class CallOfDutyOAuthModule {}
