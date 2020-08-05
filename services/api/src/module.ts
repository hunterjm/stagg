import { Module } from '@nestjs/common'
import { OAuthModule } from './oauth/module'

@Module({
  imports: [OAuthModule],
  providers: [],
  controllers: [],
})
export class RootModule {}
