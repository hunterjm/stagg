import { Module, Controller, Get } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChartModule } from './charts/module'
import { NotificationModule } from './notify/module'
import { DiscordModule } from './discord/module'
import { CallOfDutyModule } from './callofduty/module'
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
    ChartModule,
    DiscordModule,
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
