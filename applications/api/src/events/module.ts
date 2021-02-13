import { Module } from '@nestjs/common'
import { AccountModule } from 'src/account/module'
import { EventsController } from './controller'
import { DbModule } from '../module.db'
import { BotModule } from 'src/bot/module'

@Module({
  imports: [
    DbModule,
    BotModule,
    AccountModule,
  ],
  exports: [],
  providers: [],
  controllers: [EventsController],
})
export class EventsModule {}
