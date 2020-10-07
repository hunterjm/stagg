import { API } from '@stagg/callofduty'
import { Controller, Res, Post, Body, UnauthorizedException, BadGatewayException, BadRequestException } from '@nestjs/common'
import { AccountDAO, AccountLookupDAO } from 'src/callofduty/account/dao'
import { CallOfDutyOAuthCredentialsDTO } from 'src/callofduty/oauth/dto'
import { CallOfDutyOAuthService } from 'src/callofduty/oauth/services'

@Controller('callofduty/oauth')
export class CallOfDutyOAuthController {
    constructor(
        private readonly acctDAO: AccountDAO,
        private readonly lookupDAO: AccountLookupDAO,
    ) {}

    @Post('credentials')
    async CredentialLogin(@Res() res, @Body() body: CallOfDutyOAuthCredentialsDTO):Promise<{ jwt:string }> {
        let authTokens = null
        const CallOfDutyAPI = new API()
        try {
            authTokens = await CallOfDutyAPI.Login(body.email, body.password)
        } catch(e) {
            throw new UnauthorizedException(e)
        }
        const emailFound = await this.lookupDAO.findByEmail(body.email)
        if (emailFound) {
            await this.acctDAO.addAuth(emailFound.unoId, authTokens)
            return res.status(200).send({ jwt: '' })
        }
        // assume it is a new login, fetch identity and a single match for unoId
        const games = []
        const profiles = []
        const { titleIdentities } = await CallOfDutyAPI.Tokens(authTokens).Identity()
        for(const identity of titleIdentities) {
            profiles.push({ platform: identity.platform, username: identity.username })
            if (!games.includes(identity.title)) {
                games.push(identity.title)
            }
        }
        const { matches: [lastMatch] } = await CallOfDutyAPI.MatchList(profiles[0].username, profiles[0].platform, 'wz', 'mw', 0, 1)
        if (!lastMatch) {
            throw new BadRequestException('No Modern Warfare matches found')
        }
        const { player: { uno } } = lastMatch
        const existingUno = await this.lookupDAO.findByUnoId(uno)
        if (!existingUno) {
            await this.acctDAO.insert(uno, authTokens)
            await this.lookupDAO.insert(uno, null, games, profiles)
        } else {
            await this.acctDAO.addAuth(uno, authTokens)
            await this.lookupDAO.addEmail(uno, body.email)
            for(const gameId of games) {
                await this.lookupDAO.addGame(uno, gameId)
            }
            for(const profile of profiles) {
                await this.lookupDAO.addProfile(uno, profile)
            }
        }
        return res.status(existingUno ? 200 : 201).send({ jwt: '' })
    }
}
