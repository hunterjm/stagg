if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

export const PORT = Number(process.env.PORT) || 8080
export const USER_NOT_FOUND_ERR = 'user not found'
export const FAAS_ETL_COD_TTL = Number(process.env.FAAS_ETL_COD_TTL)
export const FAAS_ETL_COD_HOST = process.env.FAAS_ETL_COD_HOST
