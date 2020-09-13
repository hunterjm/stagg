import * as MW from './mw'
export { MW }

export type Game = 'mw' | 'bo4' | 'wwii'
export type GameType = 'mp' | 'wz'
export type Platform = 'uno' | 'battle' | 'psn' | 'xbl' | 'steam'
export interface Tokens {
    sso: string
    xsrf: string
    atkn: string
}
