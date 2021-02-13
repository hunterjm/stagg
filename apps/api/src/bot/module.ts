import { Module } from '@nestjs/common'
import { DiscordBotController } from './controller'

@Module({
  imports: [],
  controllers: [DiscordBotController],
})
export class DiscordBotModule {}
