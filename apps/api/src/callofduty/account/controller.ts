import * as JWT from 'jsonwebtoken'
import { API, Schema } from '@stagg/callofduty'
import {
    Controller,
    Put,
    Get,
    Post,
    Body,
    Param,
    Delete,
    NotFoundException,
    ConflictException,
    BadRequestException,
    BadGatewayException,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common'
import { AccountCredentialsDTO } from './dto'
import { AccountDAO, AccountAuthDAO } from './entity'
import { CallOfDutyAccountService } from './services'
import { PGSQL, JWT_SECRET } from 'src/config'

@Controller('callofduty/account')
export class CallOfDutyAccountController {
    constructor(
        private readonly acctDao: AccountDAO,
        private readonly authDao: AccountAuthDAO,
        private readonly acctSvcs: CallOfDutyAccountService,
    ) {}

    @Get('/etl/:accountId')
    async AccountETL(@Param() { accountId }):Promise<{ success: boolean }> {
        const acct = await this.acctDao.findById(accountId)
        if (!acct) {
            throw new BadRequestException('invalid account id')
        }
        if (!acct.auth.length) {
            throw new BadRequestException('can only run auth accounts')
        }
        this.acctSvcs.triggerETL(acct)
        return { success: true }
    }

    @Put('/:accountId/unoId/:unoId')
    async SaveAccountUnoId(@Param() { accountId, unoId }):Promise<{ success: boolean }> {
        const acct = await this.acctDao.findById(accountId)
        if (!acct) {
            throw new NotFoundException('invalid account id')
        }
        acct.unoId = unoId
        await this.acctDao.update(acct)
        return { success: true }
    }

    @Put('/:accountId/profile/:platform/:username')
    async SaveAccountProfile(@Param() { accountId, platform, username }):Promise<{ success: boolean }> {
        const acct = await this.acctDao.findById(accountId)
        if (!acct) {
            throw new NotFoundException('invalid account id')
        }
        acct.profiles.push({ username, platform })
        await this.acctDao.update(acct)
        return { success: true }
    }

    @Delete('/:accountId/profile/:platform/:username')
    async DeleteAccountProfile(@Param() { accountId, platform, username }):Promise<{ success: boolean }> {
        const acct = await this.acctDao.findById(accountId)
        if (!acct) {
            throw new NotFoundException('invalid account id')
        }
        for(const i in acct.profiles) {
            const p = acct.profiles[i]
            if (p.platform.toLowerCase() === platform.toLowerCase() && p.username.toLowerCase() === username.toLowerCase()) {
                delete acct.profiles[i]
                await this.acctDao.update(acct)
            }
        }
        return { success: true }
    }

    @Put('/:origin/:gameId/:unoId')
    async SaveDiscoveredAccount(@Param() { gameId, origin, unoId }):Promise<{ success: boolean }> {
        try {
            await this.acctDao.insert({ origin, unoId, games: [gameId], profiles: [] })
            return { success: true }
        } catch(e) {
            if (String(e.code) === String(PGSQL.CODE.DUPLICATE)) {
                throw new ConflictException(`duplicate profile for unoId ${unoId}`)
            }
            throw new InternalServerErrorException('something went wrong, please try again')
        }
    }

    @Put('/:origin/:gameId/:unoId/:platform/:username')
    async SaveDiscoveredAccountWithProfile(@Param() { gameId, origin, unoId, platform, username }):Promise<{ success: boolean }> {
        try {
            await this.acctDao.insert({ origin, unoId, games: [gameId], profiles: [{ platform, username }] })
            return { success: true }
        } catch(e) {
            if (String(e.code) === String(PGSQL.CODE.DUPLICATE)) {
                throw new ConflictException(`duplicate profile for unoId ${unoId}`)
            }
            throw new InternalServerErrorException('something went wrong, please try again')
        }
    }

    @Post('authorize')
    async CredentialsLogin(@Body() body: AccountCredentialsDTO):Promise<{ jwt:string }> {
        let authTokens = null
        const CallOfDutyAPI = new API()
        try {
            authTokens = await CallOfDutyAPI.Login(body.email, body.password)
        } catch(e) {
            throw new UnauthorizedException(e)
        }
        let userId = ''
        const games = []
        const profiles = []
        const emailFound = await this.acctDao.findByEmail(body.email)
        if (emailFound) {
            userId = emailFound.userId
        }
        const { titleIdentities } = await CallOfDutyAPI.Tokens(authTokens).Identity()
        for(const identity of titleIdentities) {
            profiles.push({ platform: identity.platform, username: identity.username })
            if (!games.includes(identity.title)) {
                games.push(identity.title)
            }
        }
        if (!profiles.length) {
            throw new BadGatewayException('no identity found for account')
        }
        const { username, platform } = profiles[0]
        if (!userId) {
            const searchByIdentity = await this.acctDao.findByProfile(username, platform)
            if (searchByIdentity) {
                userId = searchByIdentity.userId
            }
        }
        const platformIds = await CallOfDutyAPI.Platforms(username, platform)
        for(const platform of Object.keys(platformIds) as Schema.API.Platform[]) {
            const { username } = platformIds[platform]
            profiles.push({ username, platform })
        }
        // get unique profiles
        const mappedProfiles = {}
        for(const { username, platform } of profiles) {
            mappedProfiles[platform] = username
        }
        const uniqueProfiles = Object.keys(mappedProfiles).map(platform => ({ platform, username: mappedProfiles[platform] })) as any
        if (!userId) {
            for(const { username, platform } of uniqueProfiles) {
                const found = await this.acctDao.findByProfile(username, platform)
                if (found) {
                    userId = found.userId
                    break
                }
            }
        }
        const authId = await this.authDao.insert({ games, profiles: uniqueProfiles, email: body.email, auth: authTokens })
        const jwt = JWT.sign({ userId, games, profiles: uniqueProfiles, authId }, JWT_SECRET)
        return { jwt }
    }
}
