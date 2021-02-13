import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiscordService } from 'src/discord/services'
import { DiscordController } from 'src/discord/controller'
import { DiscordDbModule } from 'src/discord/module.db'
import { Discord } from '@stagg/db'

@Module({
  imports: [
    DiscordDbModule,
    TypeOrmModule.forFeature([Discord.Account.Repository], 'discord'),
  ],
  exports: [DiscordService],
  providers: [DiscordService],
  controllers: [DiscordController],
})

export class DiscordModule {}
