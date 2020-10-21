import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PGSQL } from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'stagg',
      imports: [],
      inject: [],
      useFactory: () => PGSQL.FACTORY('stagg') as any
    }),
  ],
})
export class StaggDbModule {}
