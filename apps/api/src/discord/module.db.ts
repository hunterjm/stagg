import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PGSQL } from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'discord',
      imports: [],
      inject: [],
      useFactory: () => PGSQL.FACTORY('discord') as any
    }),
  ],
})
export class DiscordDbModule {}
