export const connectionConfig = (db:string, env:Connection.RequiredEnvVars):Connection => 
    (env.NODE_ENV || '')?.includes('dev') ? local(db, env) : cloud(db, env)

const base = (db:string, env:Connection.RequiredEnvVars):Connection.Base => ({
    database: db,
    type: 'postgres',
    username: env.PGSQL_USER,
    password: env.PGSQL_PASS,
})
const local = (db:string, env:Connection.RequiredEnvVars):Connection.Local => ({
    ...base(db, env),
    extra: {
        socketPath: `${env.PGSQL_SOCKETPATH}/${env.PGSQL_INSTANCE}=tcp:${env.PGSQL_PORT}`,
    }
})
const cloud = (db:string, env:Connection.RequiredEnvVars):Connection.Cloud => ({
    ...base(db, env),
    host: `${env.PGSQL_SOCKETPATH}/${env.PGSQL_INSTANCE}`,
    port: Number(env.PGSQL_PORT || 5432),
})
type Connection = Connection.Cloud | Connection.Local
namespace Connection {
    export interface Base {
        database: string
        type: 'postgres'
        username: string
        password: string
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
        NODE_ENV:string
        PGSQL_PORT:string
        PGSQL_USER:string
        PGSQL_PASS:string
        PGSQL_INSTANCE:string
        PGSQL_SOCKETPATH:string
    }
}
