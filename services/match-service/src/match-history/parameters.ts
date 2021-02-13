import { Schema } from 'callofduty'

export interface MatchParameters {
    accountId: string
    gameId: Schema.Game
    gameType: Schema.GameType

    limit?: number
    offset?: number
    filter?: Filter
}

export interface Filter {
    and?: Filter[]
    or?: Filter[]

    modeId_eq?: Schema.Mode
    modeId_neq?: Schema.Mode
    modeId_in?: Schema.Mode[]

    startTime_lt?: number
    startTime_gt?: number

    endTime_lt?: number
    endTime_gt?: number

    teamId_eq?: string
    teamId_neq?: string
    teamId_in?: string[]

    quit_eq?: boolean

    teamPlacement_eq?: number
    teamPlacement_neq?: number
    teamPlacement_lt?: number
    teamPlacement_gt?: number
}

export const buildParameters = (accountId: string, gameId: Schema.Game, gameType: Schema.GameType, limit?: number, offset?: number, filter?: Filter): MatchParameters => {
    return {
        accountId,
        gameId,
        gameType,
        limit: limit || undefined,
        offset: offset || undefined,
        filter: filter || undefined
    }
}