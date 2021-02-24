import * as DB from '@stagg/db'
import { Config, Env, env } from '@stagg/gcp'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const config = <Config>{} // hydrated by useConfig()

export const useFactory = ():TypeOrmModuleOptions => ({
    type: 'postgres',
    database: config.postgres.db,
    username: config.postgres.user,
    password: config.postgres.pass,
    entities: [
      DB.Account.Entity,
      DB.Account.Repository,
      DB.Discord.Log.Voice.Entity,
      DB.Discord.Log.Message.Entity,
      DB.Discord.Log.Response.Entity,
      DB.Discord.Settings.Features.Entity,
      DB.CallOfDuty.Friend.Entity,
      DB.CallOfDuty.MW.Match.Entity,
      DB.CallOfDuty.WZ.Match.Entity,
      DB.CallOfDuty.MW.Profile.Entity,
      DB.CallOfDuty.MW.Profile.Mode.Entity,
      DB.CallOfDuty.WZ.Profile.Mode.Entity,
      DB.CallOfDuty.MW.Profile.Weapon.Entity,
      DB.CallOfDuty.MW.Profile.Equipment.Entity,
    ],
    synchronize: false,
    host: env === Env.Local ? config.postgres.host : config.postgres.socketpath,
})
