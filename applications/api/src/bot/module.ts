import { Account, Discord } from '@stagg/db'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BotService } from './services'
import { DbModule } from '../module.db'

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([
      Account.Repository,
      Discord.Log.Voice.Repository,
      Discord.Log.Message.Repository,
      Discord.Log.Response.Repository,
      Discord.Settings.Features.Repository,
    ], 'stagg'),
  ],
  exports: [BotService],
  providers: [BotService],
})
export class BotModule {}
