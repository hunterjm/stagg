import { MW, PlatformId, Game } from '@callofduty/types'

export interface Account extends Account.Provision {
    id: string
    discord: Account.Discord
    callofduty: Account.CallOfDuty
}
export namespace Account {
    export interface Provision {
        discord?: Account.Discord
        callofduty?: Account.CallOfDuty
    }
    export interface Discord {
        id: string
        tag: string
        avatar: string
    }
    export interface CallOfDuty {
        unoId?: string
        games: Game[]
        profiles: PlatformId[]
    }
}
