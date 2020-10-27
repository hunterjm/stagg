import { createContext } from 'react'

export interface JwtPayload {
    user: {
        userId: string
    }
    accounts: {}
}
export const JwtContext = createContext({
    jwt: {},
    setJwt: (jwt:string) => {}
})
