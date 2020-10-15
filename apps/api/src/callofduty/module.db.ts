import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PGSQL } from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        username: PGSQL.USER,
        password: PGSQL.PASS,
        database: 'callofduty',
        extra: {
          socketPath: PGSQL.SOCKETPATH,
        },
        entities: [
          'dist/**/*entity.js',
        ],
        synchronize: false,
      })
    }),
  ],
})
export class CallOfDutyDbModule {}
