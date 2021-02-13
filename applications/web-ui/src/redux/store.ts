import * as JWT from 'jsonwebtoken'
import { Model } from '@stagg/api'
import { createStore, AnyAction } from 'redux'
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper'
import { saveStateToCookie, clearAll } from 'src/redux/cookie'


interface AuthorizeDiscordAction {
    type: 'AUTHORIZE_DISCORD'
    payload: Model.Account.Discord
}

export type Action = AuthorizeDiscordAction | AnyAction
export interface State {
    account?: State.RegisteredAccount
    accountProvision?: State.UnregisteredAccount
    jwt?: State.JWTs
}
export namespace State {
    export interface JWTs {
        account?: string
        provision?: JWTs.Provision
    }
    export namespace JWTs {
        export interface Provision {
            discord?: string
            callofduty?: string
        }
    }
    export interface UnregisteredAccount {
        discord?: Model.Account.Discord
        callofduty?: Model.Account.CallOfDuty
    }
    export interface RegisteredAccount extends UnregisteredAccount {
        id: string
        discord: Model.Account.Discord
        callofduty: Model.Account.CallOfDuty
    }
}

const initialState = {}
const reducer = (state:State=initialState, action:Action) => {
    let registeredAccount = null
    let provisionedAccount = null
    switch (action.type) {
        case 'CLEAR_ALL':
            clearAll()
            return {}
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return saveStateToCookie({ ...state, ...action.payload })
        case 'AUTHORIZED_ACCOUNT':
            registeredAccount = null
            if (action.payload) {
                const { account } = JWT.decode(action.payload) as any
                registeredAccount = account
            }
            return saveStateToCookie({
                account: registeredAccount,
                jwt: {
                    account: action.payload,
                }
            })
        case 'PROVISIONED_DISCORD':
            provisionedAccount = null
            if (action.payload) {
                const { accountProvision } = JWT.decode(action.payload) as any
                provisionedAccount = accountProvision
            }
            return saveStateToCookie({
                ...state,
                accountProvision: {
                    ...state.accountProvision,
                    discord: provisionedAccount,
                },
                jwt: {
                    ...state.jwt,
                    provision: {
                        ...state.jwt?.provision,
                        discord: action.payload
                    }
                }
            })
        case 'PROVISIONED_CALLOFDUTY':
            provisionedAccount = null
            if (action.payload) {
                const { accountProvision } = JWT.decode(action.payload) as any
                provisionedAccount = accountProvision
            }
            return saveStateToCookie({
                ...state,
                accountProvision: {
                    ...state.accountProvision,
                    callofduty: provisionedAccount,
                },
                jwt: {
                    ...state.jwt,
                    provision: {
                        ...state.jwt?.provision,
                        callofduty: action.payload
                    }
                }
            })
        default:
            return state
    }
}
// create a makeStore function
const makeStore: MakeStore<State> = (context:Context) => createStore(reducer)

// export an assembled wrapper
export const reduxWrapper = createWrapper<State>(makeStore, { debug: false })
