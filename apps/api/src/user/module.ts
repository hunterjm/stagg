import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiscordModule } from 'src/discord/module'
import { UserService } from 'src/user/services'
import { UserController } from 'src/user/controller'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { Stagg } from '@stagg/db'
import { StaggDbModule } from 'src/module.db'

@Module({
  imports: [
    StaggDbModule,
    forwardRef(() => DiscordModule),
    forwardRef(() => CallOfDutyAccountModule),
    TypeOrmModule.forFeature([Stagg.User.Repository], 'stagg'),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})

export class UserModule {}
