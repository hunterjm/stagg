import { Module, Controller, Get } from '@nestjs/common'
import { ChartModule } from './charts/module'
import { DiscordModule } from './discord/module'
import { CallOfDutyModule } from './callofduty/module'
import { MailModule } from './mail/module'
import { UserModule } from './user/module'


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
    UserModule,
    MailModule,
    ChartModule,
    DiscordModule,
    CallOfDutyModule,
  ],
})
export class RootModule {}
