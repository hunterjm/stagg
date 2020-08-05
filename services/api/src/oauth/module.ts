import { Module } from '@nestjs/common'
import { CallOfDutyOAuthModule } from './callofduty/module'

@Module({
  imports: [CallOfDutyOAuthModule],
  providers: [],
  controllers: [],
})
export class OAuthModule {}
