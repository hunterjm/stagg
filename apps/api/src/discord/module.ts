import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account, AccountDAO } from 'src/discord/entity'
import { DiscordService } from 'src/discord/services'
import { DiscordBotModule } from 'src/discord/bot/module'
import { DiscordController } from 'src/discord/controller'
import { DiscordDbModule } from 'src/discord/module.db'

@Module({
  imports: [
    UserModule,
    DiscordDbModule,
    DiscordBotModule,
    TypeOrmModule.forFeature([Account], 'discord'),
  ],
  exports: [DiscordService],
  providers: [DiscordService, AccountDAO],
  controllers: [DiscordController],
})

export class DiscordModule {}
