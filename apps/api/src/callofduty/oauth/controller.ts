import { API, Schema } from '@stagg/callofduty'
import { Controller, Res, Post, Body, UnauthorizedException, BadGatewayException, BadRequestException } from '@nestjs/common'
import { AccountDAO } from 'src/callofduty/account/entity'
import { CallOfDutyOAuthCredentialsDTO } from 'src/callofduty/oauth/dto'

@Controller('callofduty/oauth')
export class CallOfDutyOAuthController {
    constructor(
        private readonly acctDAO: AccountDAO,
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
        const emailFound = await this.acctDAO.findByEmail(body.email)
        if (emailFound) {
            emailFound.auth.push(authTokens)
            await this.acctDAO.update(emailFound)
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
        if (!profiles.length) {
            throw new BadRequestException('no identity found for account')
        }
        const { username, platform } = profiles[0]
        // if not found by email, try fetching identity profiles
        const searchByIdentity = await this.acctDAO.findByProfile(username, platform)
        if (searchByIdentity) {
            searchByIdentity.auth.push(authTokens)
            await this.acctDAO.update(searchByIdentity)
            return res.status(200).send({ jwt: '' })
        }
        // if not found by identity profiles, try fetching all platform profiles
        const platformIds = await CallOfDutyAPI.Platforms(username, platform)
        for(const platform of Object.keys(platformIds) as Schema.API.Platform[]) {
            const { username } = platformIds[platform]
            profiles.push({ username, platform })
            const found = await this.acctDAO.findByProfile(username, platform)
            if (found) {
                found.auth.push(authTokens)
                await this.acctDAO.update(found)
                return res.status(200).send({ jwt: '' })
            }
        }
        // if still no profile matches, assume it is a new login and create account
        await this.acctDAO.insert({ games, profiles, emails: [body.email], auth: [authTokens] })
        // !! TODO: should kick-off ETL for new account so it doesn't wait in queue
        return res.status(201).send({ jwt: '' })
    }
}
