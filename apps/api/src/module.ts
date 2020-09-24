import { Module, Controller, Get } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChartModule } from './charts/module'
import { NotificationModule } from './notify/module'
import { DiscordModule } from './discord/module'
import { CallOfDutyModule } from './callofduty/module'
import { RenderModule } from './render/module'
import { MailModule } from './mail/module'
import { WebHooksModule } from './webhooks/module'
import { MONGO } from './config'


@Controller('/')
export class RootController {
    constructor() {}
    @Get('health')
    async HealthCheck():Promise<string> {
      return 'ok'
    }
}

@Module({
  controllers: [],
  imports: [
    MailModule,
    ChartModule,
    RenderModule,
    DiscordModule,
    WebHooksModule,
    CallOfDutyModule,
    NotificationModule,
    MongooseModule.forRoot(
      MONGO.CONNECTION_STR('stagg'),
      { connectionName: 'stagg' }
    ),
    MongooseModule.forRoot(
      MONGO.CONNECTION_STR('discord'),
      { connectionName: 'discord' }
    ),
    MongooseModule.forRoot(
      MONGO.CONNECTION_STR('callofduty'),
      { connectionName: 'callofduty' }
    )
  ],
})
export class RootModule {}
