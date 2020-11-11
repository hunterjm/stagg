import API from './api'
import * as Assets from './assets'
import * as Schema from './schema'

export { API, Assets, Schema }

export enum ErrorType {
    Captcha = 'captcha', // Security captcha required for login
    DataStore = 'datastore', // Internal error with datastore
    Unauthorized = 'unauthorized', // Invalid email/password
    Uninitialized = 'uninitialized', // No CSRF token available
}
export interface Error {
    type: ErrorType
    message: string
    datasource: {
        type: string
        message: string
    }
}
