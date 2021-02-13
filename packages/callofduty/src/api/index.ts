import * as deprecatedRequest from 'request'
import axios, { AxiosRequestConfig } from 'axios'
import * as Schema from '../schema'
import * as Routes from './routes'

/** Call of Duty API */
export default class {
    constructor(
        protected readonly tokens = <Schema.Tokens>{},
        protected readonly logger = <Function>console.log,
    ) {}
    /** Assign tokens for authenticated requests */
    public UseTokens({ sso, atkn, xsrf }:Schema.Tokens) {
        this.tokens.sso = sso
        this.tokens.atkn = atkn
        this.tokens.xsrf = xsrf
        return this
    }
    /** Fetches primary identity for the authenticated account */
    public async Identity():Promise<Routes.Identity> {
        return this.AuthenticatedRequest({ url: `/crm/cod/v2/identities` })
    }
    /** Fetches friends list for the authenticated account */
    public async Friends():Promise<Routes.Friends> {
        return this.AuthenticatedRequest({ url: `/codfriends/v1/compendium` })
    }
    /** Fetches full account identifiers list for the authenticated account */
    public async Accounts(profileId:Schema.ProfileId):Promise<Routes.Accounts> {
        return this.AuthenticatedRequest({ url: `/crm/cod/v2/accounts/${this.PlayerUrl(profileId)}` })
    }
    /** Fetches profile data for the provided profile, game, and gameType */
    async Profile(profileId:Schema.ProfileId, gameType:Schema.GameType, game:Schema.Game):Promise<Routes.Profile> {
        return this.AuthenticatedRequest({ url: `/stats/cod/v1/title/${game}/${this.PlayerUrl(profileId)}/profile/type/${gameType}` })
    }
    /** Fetches all match map events for the provided matchId and game */
    async MatchEvents(matchId:string, game:Schema.Game):Promise<Routes.MatchEvents> {
        return this.GenericRequest({ url: `/ce/v1/title/${game}/platform/battle/match/${matchId}/matchMapEvents` })
    }
    /** Fetches all match details including player stats for the provided matchId, game, and gameType */
    async MatchDetails(matchId:string, gameType:Schema.GameType, game:Schema.Game):Promise<Routes.MatchDetails> {
        return this.GenericRequest({ url: `/crm/cod/v2/title/${game}/platform/battle/fullMatch/${gameType}/${matchId}/it` })
    }
    /** Fetches up to 20 matches for the provided profile, game, and gameType */
    async MatchHistory(profileId:Schema.ProfileId, gameType:Schema.GameType, game:Schema.Game, next:number=0, limit:number=20):Promise<Routes.MatchHistory> {
        return this.AuthenticatedRequest({ url: `/crm/cod/v2/title/${game}/${this.PlayerUrl(profileId)}/matches/${gameType}/start/0/end/${next}/details?limit=${limit}` })
    }
    /** Fetches an isolated match summary for the provided match history record */
    async MatchSummary(match:Schema.Match, game:Schema.Game):Promise<Routes.MatchHistory> {
        const playerUrl = this.PlayerUrl({ unoId: match.player.uno })
        const endThreshold = (Number(match.utcEndSeconds) + 25) * 1000
        const startThreshold = (Number(match.utcStartSeconds) - 25) * 1000
        return this.AuthenticatedRequest({ url: `/crm/cod/v2/title/${game}/${playerUrl}/matches/${match.gameType}/start/${startThreshold}/end/${endThreshold}/details` })
    }
    /** Login - exchange username + password for authentication tokens */
    public async Authorize(email:string, password:string, useTokens:boolean=true):Promise<{ xsrf: string, atkn: string, sso: string }> {
        const initialPageLoad = await axios.get('https://profile.callofduty.com/login')
        const xsrf = initialPageLoad?.headers['set-cookie'].find((cookie:string) => cookie.includes('XSRF-TOKEN='))?.replace(/^XSRF-TOKEN=([^;]+);.*$/, '$1')
        if (!xsrf) {
            throw 'missing xsrf token'
        }
        // No response cookies with Axios so fugg it for now
        const { headers } = await this.AnonymousRequest({
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
            if (useTokens) {
                this.UseTokens({ xsrf, atkn, sso })
            }
            return { xsrf, atkn, sso }
        } catch(e) {
            throw 'invalid credentials'
        }
    }
    /** Generate platform profile URL for provided profileId */
    protected PlayerUrl(profileId:Schema.ProfileId) {
        const { unoId } = <Schema.ProfileId.UnoId>profileId
        const { username, platform } = <Schema.ProfileId.PlatformId>profileId
        const acctIdentifier = unoId ? unoId : username
        const platformSegment = unoId ? 'uno/uno' : `${platform}/gamer`
        return `platform/${platformSegment}/${encodeURIComponent(acctIdentifier)}`
    }
    /** Facilitate an anonymous request to any URL via deprecated request npm module */
    protected async AnonymousRequest(cfg:any):Promise<any> {
        return new Promise((resolve,reject) => deprecatedRequest(cfg, (err:any,res:any) => err ? reject(err) : resolve(res)))
    }
    /** Facilitate a generic request to the API client */
    protected async GenericRequest(config:Partial<AxiosRequestConfig>, headers?:any):Promise<any> {
        this.logger(`[>] API.CallOfDuty: https://my.callofduty.com/api/papi-client${config.url}`)
        const { data:res, status } = await axios({
            method: 'GET',
            baseURL: 'https://my.callofduty.com/api/papi-client',
            headers: { 'Cache-Control': 'no-cache', ...headers },
            ...config,
        })
        if (status !== 200 || res.status !== 'success') {
            this.logger('[!] API Error:', res.data.message.replace('Not permitted: ', ''), res)
            throw res.data.message.replace('Not permitted: ', '')
        }
        return res.data
    }
    /** Facilitate an authenticated request to the API client */
    protected async AuthenticatedRequest(config:Partial<AxiosRequestConfig>):Promise<any> {
        if (!this.tokens.xsrf || !this.tokens.atkn || !this.tokens.sso) {
            throw new Error('Missing tokens for Call of Duty API')
        }
        const cookieStr = `atkn=${this.tokens.atkn};`
            + `ACT_SSO_COOKIE=${this.tokens.sso};`
            + `API_CSRF_TOKEN=${this.tokens.xsrf};`
            + `ACT_SSO_COOKIE_EXPIRY=1591153892430;`
        return this.GenericRequest(config, { Cookie: cookieStr })
    }
}
