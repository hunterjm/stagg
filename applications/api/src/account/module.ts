import { Account } from '@stagg/db'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountService } from './services'
import { AccountController } from './controller'
import { DbModule } from '../module.db'

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([
      Account.Repository,
    ], 'stagg'),
  ],
  exports: [AccountService],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
