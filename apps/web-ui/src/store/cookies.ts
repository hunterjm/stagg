import cookies from 'js-cookie'
export class Cookies {
    public get jwtCallOfDuty() {
        return cookies.get('jwt.callofduty')
    }
    public set jwtCallOfDuty(jwt:string) {
        cookies.set('jwt.callofduty', jwt)
    }
    
    public get jwtDiscord() {
        return cookies.get('jwt.discord')
    }
    public set jwtDiscord(jwt:string) {
        cookies.set('jwt.discord', jwt)
    }
    
    public get jwtUser() {
        return cookies.get('jwt.user')
    }
    public set jwtUser(jwt:string) {
        cookies.set('jwt.user', jwt)
    }
}
