export * from './friends'
export * from './accounts'
import * as MW from './mw'
import * as Routes from '../api/routes'

export { MW, Routes }

export type Game = 'mw' | 'bo4' | 'wwii'
export type GameType = 'mp' | 'wz'
export type Tokens = { sso: string, atkn: string, xsrf: string }

export type Match = MW.Match
export type Profile = MW.Profile
