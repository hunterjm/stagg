import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PGSQL } from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'callofduty',
      imports: [],
      inject: [],
      useFactory: () => PGSQL.FACTORY('callofduty') as any
    }),
  ],
})
export class CallOfDutyDbModule {}
