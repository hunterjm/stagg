import * as JWT from 'jsonwebtoken'
import { config } from 'src/config'
export type SignedJWT<T> = string
export const signJwt = <T>(payload:any):SignedJWT<T> => JWT.sign(payload, config.jwt.secret)
export const verifyJwt = <T>(jwt:string):T => {

    try {
        JWT.verify(jwt, config.jwt.secret)
        return JWT.decode(jwt) as T
    } catch(e) {
        return null
    }
}
