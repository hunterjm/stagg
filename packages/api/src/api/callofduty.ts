import * as deprecatedRequest from 'request'
import axios, { AxiosRequestConfig } from 'axios'
import { Schema } from '..'
export default class {
    private tokens:Schema.CallOfDuty.Tokens
    constructor(tokens?:Schema.CallOfDuty.Tokens) {
        this.Tokens(tokens)
    }

    get WZ() {
        return {
           Matches: async (username: string, platform: Schema.CallOfDuty.Platform, next: number= 0):Promise<Schema.CallOfDuty.Res.Warzone.Matches> => {
                return this.Matches(username, platform, 'wz', 'mw', next) as Promise<Schema.CallOfDuty.Res.Warzone.Matches>
           }
        }
    }

    get MW() {
        return {
            Matches: async (username: string, platform: Schema.CallOfDuty.Platform, next: number= 0):Promise<Schema.CallOfDuty.Res.ModernWarfare.Matches> => {
                return this.Matches(username, platform, 'mp', 'mw', next) as Promise<Schema.CallOfDuty.Res.ModernWarfare.Matches>
           }
        }
    }

    private async request(config:Partial<AxiosRequestConfig>):Promise<any> {
        if (!this.tokens.xsrf || !this.tokens.atkn || !this.tokens.sso) {
            throw new Error('Missing tokens for Call of Duty API')
        }
        const { data:res, status } = await axios({
            method: 'GET',
            baseURL: 'https://my.callofduty.com/api/papi-client',
            headers: {
                'Cache-Control': 'no-cache',
                Cookie: `ACT_SSO_COOKIE=${this.tokens.sso}; ACT_SSO_COOKIE_EXPIRY=1591153892430; atkn=${this.tokens.atkn}; API_CSRF_TOKEN=${this.tokens.xsrf}`
            }, ...config,
        })
        if (status !== 200 || res.status !== 'success') {
            console.log('[!] API Error:', res.data.message.replace('Not permitted: ', ''))
            throw res.data.message.replace('Not permitted: ', '')
        }
        return res.data
    }
    Tokens(tokens?:Schema.CallOfDuty.Tokens) {
        this.tokens = tokens
        return this
    }
    async Identity():Promise<Schema.CallOfDuty.Res.Identity> {
        return this.request({ url: `/crm/cod/v2/identities` })
    }
    async Friends():Promise<Schema.CallOfDuty.Res.Friends> {
        return this.request({ url: `/codfriends/v1/compendium` })
    }
    async Platforms(username:string, platform:Schema.CallOfDuty.Platform='uno'):Promise<Schema.CallOfDuty.Res.Platforms> {
        return this.request({ url: `/crm/cod/v2/accounts/platform/${platform}/gamer/${encodeURIComponent(username)}` })
    }
    async Profile(username:string, platform:Schema.CallOfDuty.Platform='uno', mode:Schema.CallOfDuty.Mode='wz', game:Schema.CallOfDuty.Game='mw'):Promise<Schema.CallOfDuty.Res.Warzone.Profile> {
        return this.request({ url: `/stats/cod/v1/title/${game}/platform/${platform}/gamer/${encodeURIComponent(username)}/profile/type/${mode}` })
    }
    async Matches(username:string, platform:Schema.CallOfDuty.Platform='uno', mode:Schema.CallOfDuty.Mode='wz', game:Schema.CallOfDuty.Game='mw', next:number=0):Promise<Schema.CallOfDuty.Res.Warzone.Matches|Schema.CallOfDuty.Res.ModernWarfare.Matches> {
        return this.request({ url: `/crm/cod/v2/title/${game}/platform/${platform}/gamer/${encodeURIComponent(username)}/matches/${mode}/start/0/end/${next}/details` })
    }
    async Login(email:string, password:string):Promise<{ xsrf: string, atkn: string, sso: string }> {
        const response = await axios.get('https://profile.callofduty.com/login')
        const xsrf = response?.headers['set-cookie'].find((cookie:string) => cookie.includes('XSRF-TOKEN='))?.replace(/^XSRF-TOKEN=([^;]+);.*$/, '$1')
        const fetch = (cfg:any):Promise<any> => new Promise((resolve,reject) => deprecatedRequest(cfg, (err:any,res:any) => err ? reject(err) : resolve(res)))
        if (!xsrf) {
            throw 'missing xsrf token'
        }
        // No response cookies with Axios so fugg it for now
        const { headers } = await fetch({
            method: 'POST',
            url: 'https://profile.callofduty.com/do_login?new_SiteId=cod',
            headers: {
                'Cookie': `XSRF-TOKEN=${xsrf}; new_SiteId=cod;`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                username:email,
                password,
                remember_me: 'true',
                _csrf: xsrf
            }
        })
        if (headers.location.toLowerCase().includes('captcha')) {
            throw 'captcha required'
        }
        try {
            const atkn = headers['set-cookie'].find((cookie:string) => cookie.includes('atkn='))?.replace(/^atkn=([^;]+);.*$/, '$1')
            const sso = headers['set-cookie'].find((cookie:string) => cookie.includes('ACT_SSO_COOKIE='))?.replace(/^ACT_SSO_COOKIE=([^;]+);.*$/, '$1')
            if (!atkn || !sso) throw 'invalid credentials'
            return { xsrf, atkn, sso }
        } catch(e) {
            throw 'invalid credentials'
        }
    }
}

