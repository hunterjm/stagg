import { Module } from '@nestjs/common'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { CallOfDutyOAuthService } from 'src/callofduty/oauth/services'
import { CallOfDutyOAuthController } from 'src/callofduty/oauth/controller'
import { CallOfDutyEtlModule } from 'src/callofduty/etl/module'
import { UserModule } from 'src/user/module'

@Module({
  imports: [UserModule, CallOfDutyAccountModule, CallOfDutyEtlModule],
  providers: [CallOfDutyOAuthService],
  controllers: [CallOfDutyOAuthController],
})
export class CallOfDutyOAuthModule {}
