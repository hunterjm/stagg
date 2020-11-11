import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account, AccountDAO } from 'src/discord/entity'
import { DiscordService } from 'src/discord/services'
import { DiscordController } from 'src/discord/controller'
import { DiscordDbModule } from 'src/discord/module.db'

@Module({
  imports: [
    DiscordDbModule,
    TypeOrmModule.forFeature([Account], 'discord'),
  ],
  exports: [DiscordService],
  providers: [DiscordService, AccountDAO],
  controllers: [DiscordController],
})

export class DiscordModule {}
