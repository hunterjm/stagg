import { Module } from '@nestjs/common'
import { DiscordService } from './services'
import { DiscordController } from './controller'
import { AccountModule } from 'src/account/module'

@Module({
  imports: [AccountModule],
  exports: [],
  providers: [DiscordService],
  controllers: [DiscordController],
})

export class DiscordModule {}
