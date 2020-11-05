import { Schema } from 'callofduty'
import * as JWT from 'jsonwebtoken'
import { API } from '.'

export interface DecodedJWT {
    id: string
    email: string
    discord: {
        id: string
        shortcuts?: string[]
    }
    callofduty: {
      id: string
      profiles: { [key:string]: string } // { platform: username }
    }
}
export interface LoginResponse {
    jwt: string
}
export interface LoginResult {
    response: any
    errors?: string[]
    forward?: string
}
export const login = async (email:string, password:string):Promise<LoginResult> => {
    const { status, message, response } = await API.Post<LoginResponse>('/callofduty/account/authorize', { email, password })
    if (response?.jwt) {
        // const decoded = JWT.decode(response.jwt) as DecodedJWT
        // const encodedUsername = decoded?.callofduty?.profiles?.uno?.replace('#', '@')
        const forward = '/me' // status === 201 ? `/callofduty/uploading/${decoded.callofduty.id}` : `/callofduty/${encodedUsername}`
        return {
            forward,
            response,
            errors: [],
        }
    }
    return {
        response,
        forward: '',
        errors: Array.isArray(message) ? message : [message],
    }
}
export interface ProfileDiffResponse {
    account: {
        _id: string
        games: Schema.API.Game[]
        profiles: { [key:string]: string } // { platform: username }
        matches: {
            [key:string]: { // { game: { mp: matchCount, wz: matchCount } }
                mp: number
                wz: number
            }
        }
    }
    profile: {
        matches: {
            [key:string]: number // { game: matchCount } 
        }
    }
}
export const profileDiff = async (accountId:string):Promise<ProfileDiffResponse> => {
    const { response } = await API.Get<ProfileDiffResponse>(`/callofduty/profile/diff/account/${accountId}`)
    return response
}
