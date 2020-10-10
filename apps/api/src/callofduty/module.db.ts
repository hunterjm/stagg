import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { POSTGRES } from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        username: POSTGRES.USER,
        password: POSTGRES.PASS,
        database: 'callofduty',
        extra: {
          socketPath: POSTGRES.SOCKETPATH,
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
