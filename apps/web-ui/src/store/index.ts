import * as IDB from './idb'
import * as MobX from './mobx'
export const IndexedDB = IDB
export const { Instance, Context } = MobX
export namespace Types {
    export type Match = any
    export type Performance = any
    export interface Profile {
        mode: string
        platform: string
        username: string
        key?: string // added by getter
        sync?: Profile.Sync // added by actions
    }
    export namespace Profile {
        export enum Status {
            None,
            Created,
            Loading,
            Downloading,
            Complete,
            Abandoned,
        }
        export interface Sync {
            status: Profile.Status
            last: number // timestamp in seconds of last transmission
            expected: number // diff aka total number of downloads expected
            matches: number // number of new matches downloaded
            performances: number // number of new performances downloaded
            loaded: number // number of matches loaded from IndexedDB
            recorded: number // total number of matches in IndexedDB
        }
    }
    // MatchMap: { matchId: match }
    export interface MatchMap { [key:string]: Match }
    // PerformanceMap: { matchId: performance }
    export interface PerformanceMap { [key:string]: Performance }
    // ProfilePerformanceMap: { [mode.platform.username]: { matchId: performanceMap } }
    export interface ProfilePerformanceMap { [key:string]: Performance[] }
}