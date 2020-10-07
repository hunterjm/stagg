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
        host: POSTGRES.HOST,
        port: POSTGRES.PORT,
        username: POSTGRES.USER,
        password: POSTGRES.PASS,
        database: 'callofduty',
        entities: [
          'dist/**/*entity.js',
        ],
        logging: ['query', 'error'],
        synchronize: false,
      })
    }),
  ],
})
export class CallOfDutyDbModule {}
