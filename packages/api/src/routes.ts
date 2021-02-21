import { Tokens } from '@callofduty/types'
import { Model } from '.'
export namespace Account {
    export interface Registration {
        account: Model.Account
    }
}
export namespace Discord {
    export interface OAuthExchange {
        account: Model.Account | null
        accountProvision: Model.Account.Discord | null
    }
}
export namespace CallOfDuty {
    export interface Authorization {
        account: Model.Account | null
        accountProvision: Model.Account.CallOfDuty | null
        authorizationProvision: Tokens
    }
    export namespace MW {
        export interface Profile {
            account: Model.Account
            profile: Model.MW.Profile
        }
    }
    export namespace WZ {
        export interface Profile {
            account: Model.Account
            profile: Model.WZ.Profile
        }
    }
}
