import * as deprecatedRequest from 'request'
import axios, { AxiosRequestConfig } from 'axios'
import { Schema } from '.'
export default class {
    private logger:Function
    private tokens:Schema.API.Tokens
    private readonly baseUrl:string = 'https://my.callofduty.com/api/papi-client'
    constructor(tokens?:Schema.API.Tokens, logger:Function=console.log) {
        this.Tokens(tokens)
        this.logger = logger
    }
    private async request(config:Partial<AxiosRequestConfig>):Promise<any> {
        if (!this.tokens.xsrf || !this.tokens.atkn || !this.tokens.sso) {
            throw new Error('Missing tokens for Call of Duty API')
        }
        this.logger(`[>] API.CallOfDuty: ${this.baseUrl}${config.url}`)
        const { data:res, status } = await axios({
            method: 'GET',
            baseURL: this.baseUrl,
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
    Tokens(tokens?:Schema.API.Tokens) {
        this.tokens = tokens
        return this
    }
    PlayerURL(username:string, platform:Schema.API.Platform='uno') {
        const profileType = !username.match('[^0-9]') ? 'uno' : 'gamer'
        return `platform/${platform}/${profileType}/${encodeURIComponent(username)}`
    }
    async Identity():Promise<Schema.API.MW.Routes.Identity> {
        return this.request({ url: `/crm/cod/v2/identities` })
    }
    async Friends():Promise<Schema.API.MW.Routes.Friends> {
        return this.request({ url: `/codfriends/v1/compendium` })
    }
    async Platforms(username:string, platform:Schema.API.Platform='uno'):Promise<Schema.API.MW.Routes.Platforms> {
        return this.request({ url: `/crm/cod/v2/accounts/platform/${platform}/gamer/${encodeURIComponent(username)}` })
    }
    async Profile(username:string, platform:Schema.API.Platform='uno', mode:Schema.API.GameType='wz', game:Schema.API.Game='mw'):Promise<Schema.API.MW.WZ.Profile> {
        return this.request({ url: `/stats/cod/v1/title/${game}/${this.PlayerURL(username, platform)}/profile/type/${mode}` })
    }
    async Matches(username:string, platform:Schema.API.Platform='uno', mode:Schema.API.GameType='wz', game:Schema.API.Game='mw', next:number=0):Promise<Schema.API.MW.Routes.Matches> {
        return this.request({ url: `/crm/cod/v2/title/${game}/${this.PlayerURL(username, platform)}/matches/${mode}/start/0/end/${next}/details` })
    }
    async MatchEvents(matchId:string, game:Schema.API.Game='mw') {
        return this.request({ url: `/ce/v1/title/${game}/platform/battle/match/${matchId}/matchMapEvents` })
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
