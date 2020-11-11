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
export const profilesByUserId = async (userId:string) => {
    const { response } = await API.Get<any>(`/callofduty/account/user/${userId}`)
    return response
}
export const matchHistoryByUserId = async (userId:string, gameId:Schema.Game, gameType:Schema.GameType):Promise<any> => {
    const { response } = await API.Get<any>(`/callofduty/match/${gameId}/${gameType}/user/${userId}/history`)
    return response
}
