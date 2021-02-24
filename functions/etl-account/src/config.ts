import * as DB from '@stagg/db'
import { Config, Env, env } from '@stagg/gcp'
import { ConnectionOptions } from 'typeorm'

export const config = <Config>{}

export const useConnection = ():ConnectionOptions => ({
    type: 'postgres',
    host: env === Env.Local ? config.postgres.host : config.postgres.socketpath,
    username: config.postgres.user,
    password: config.postgres.pass,
    database: config.postgres.db,
    entities: [
        DB.Account.Entity,
        DB.CallOfDuty.Friend.Entity,
        DB.CallOfDuty.MW.Match.Entity,
        DB.CallOfDuty.MW.Profile.Entity,
        DB.CallOfDuty.MW.Profile.Mode.Entity,
        DB.CallOfDuty.WZ.Match.Entity,
        DB.CallOfDuty.WZ.Loadout.Entity,
        DB.CallOfDuty.WZ.Profile.Mode.Entity,
        DB.CallOfDuty.MW.Profile.Weapon.Entity,
        DB.CallOfDuty.MW.Profile.Equipment.Entity,
    ]
})
