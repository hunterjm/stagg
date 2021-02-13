import { CallOfDuty, Discord, Stagg } from '.'

export const connectionConfig = (db:Connection.Database, env:Connection.RequiredEnvVars):Connection => 
    (env.NODE_ENV || '')?.includes('dev') ? local(db, env) : cloud(db, env)

const entities = {
    'stagg': [
        Stagg.User.Entity,
    ],
    'discord': [
        Discord.Account.Entity,
    ],
    'callofduty': [
        CallOfDuty.Account.Base.Entity,
        CallOfDuty.Account.Auth.Entity,
        CallOfDuty.Account.Profile.Entity,
        CallOfDuty.Match.MW.MP.Detail.Entity,
        CallOfDuty.Match.MW.MP.Stats.Entity,
        CallOfDuty.Match.MW.MP.Killstreak.Entity,
        CallOfDuty.Match.MW.MP.Loadout.Entity,
        CallOfDuty.Match.MW.MP.Objective.Entity,
        CallOfDuty.Match.MW.MP.Weapon.Entity,
        CallOfDuty.Match.MW.WZ.Detail.Entity,
        CallOfDuty.Match.MW.WZ.Stats.Entity,
        CallOfDuty.Match.MW.WZ.Loadout.Entity,
        CallOfDuty.Match.MW.WZ.Objective.Entity,
    ]
}

const base = (db:Connection.Database, env:Connection.RequiredEnvVars):Connection.Base => ({
    database: db,
    type: 'postgres',
    username: env.PGSQL_USER,
    password: env.PGSQL_PASS,
    entities: entities[db]
})
const local = (db:Connection.Database, env:Connection.RequiredEnvVars):Connection.Local => ({
    ...base(db, env),
    extra: {
        socketPath: `${env.PGSQL_SOCKETPATH}/${env.PGSQL_INSTANCE}=tcp:${env.PGSQL_PORT}`,
    }
})
const cloud = (db:Connection.Database, env:Connection.RequiredEnvVars):Connection.Cloud => ({
    ...base(db, env),
    host: `${env.PGSQL_SOCKETPATH}/${env.PGSQL_INSTANCE}`,
    port: Number(env.PGSQL_PORT || 5432),
})
type Connection = Connection.Cloud | Connection.Local
namespace Connection {
    export type Database = 'stagg' | 'discord' | 'callofduty'
    export interface Base {
        database: string
        type: 'postgres'
        username: string
        password: string
        entities?: Function[]
    }
    export interface Cloud extends Base {
        port: number
        host: string // <SOCKETPATH>/<INSTANCE>
    }
    export interface Local extends Base {
        extra: {
            socketPath: string // <SOCKETPATH>/<INSTANCE>=tcp:<PORT>
        }
    }
    export interface RequiredEnvVars {
        NODE_ENV: string
        PGSQL_PORT: string
        PGSQL_USER: string
        PGSQL_PASS: string
        PGSQL_INSTANCE: string
        PGSQL_SOCKETPATH: string
    }
}
