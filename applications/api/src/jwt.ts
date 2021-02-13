import * as JWT from 'jsonwebtoken'
import { SECRETS } from 'src/config'
export type SignedJWT<T> = string
export const signJwt = <T>(payload:any):SignedJWT<T> => JWT.sign(payload, SECRETS.JWT)
export const verifyJwt = <T>(jwt:string):T => {

    try {
        JWT.verify(jwt, SECRETS.JWT)
        return JWT.decode(jwt) as T
    } catch(e) {
        return null
    }
}
