import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.services';
import { OAuthService } from './oauth/oauth.services';
import { OAuthController } from './oauth/oauth.controller';

@Module({
  imports: [],
  providers: [AppService, OAuthService],
  controllers: [AppController, OAuthController],
})
export class AppModule {}
