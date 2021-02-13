if (process.env.NODE_ENV == 'development') {
    require('dotenv').config()
}

export const PGSQL = {
    NODE_ENV: process.env.NODE_ENV,
    PGSQL_PORT: process.env.PGSQL_PORT,
    PGSQL_USER: process.env.PGSQL_USER,
    PGSQL_PASS: process.env.PGSQL_PASS,
    PGSQL_INSTANCE: process.env.PGSQL_INSTANCE,
    PGSQL_SOCKETPATH: process.env.PGSQL_SOCKETPATH,
}