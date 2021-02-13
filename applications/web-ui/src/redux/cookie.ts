import Cookies from 'js-cookie'
import { State, Action } from 'src/redux/store'

export const clearAll = () => {
    Cookies.remove('jwt')
    Cookies.remove('state')
}

export const getStateFromRawCookieHeader = (cookieStr:string):State => {
    const cookieObj = {}
    for(const c of cookieStr.split(';')) {
        const [key, value] = c.trim().split('=')
        cookieObj[key] = value
    }
    return getStateFromBase64(cookieObj['state'])
}
export const getStateFromBase64 = (cookieStateStr:string):State => {
    if (!cookieStateStr) {
        return {}
    }
    const cookieStateJson = Buffer.from(cookieStateStr, 'base64').toString()
    if (!cookieStateJson) {
        return {}
    }
    const initialState = JSON.parse(cookieStateJson)
    if (!initialState) {
        return {}
    }
    return initialState
}
export const getActionsFromState = (state?:State):Action[] => {
    const actions:Action[] = []
    if (state?.jwt?.account) {
        actions.push({ type: 'AUTHORIZED_ACCOUNT', payload: state?.jwt?.account })
    }
    if (state.jwt?.provision?.discord) {
        actions.push({ type: 'PROVISIONED_DISCORD', payload: state.jwt?.provision?.discord })
    }
    if (state.jwt?.provision?.callofduty) {
        actions.push({ type: 'PROVISIONED_CALLOFDUTY', payload: state.jwt?.provision?.callofduty  })
    }
    return actions
}
export const saveStateToCookie = (state:State):State => {
    const stateJson = JSON.stringify(state)
    const encodedState = Buffer.from(stateJson).toString('base64')
    Cookies.set('state', encodedState)
    return state
}
