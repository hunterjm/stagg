import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { useFactory } from 'src/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ name: 'stagg', useFactory }),
  ],
})

export class DbModule {}
