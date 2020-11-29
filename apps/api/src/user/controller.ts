import * as JWT from 'jsonwebtoken'
import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common'
import { UserService } from 'src/user/services'
import { DiscordService, DiscordAuthorizationJWT } from 'src/discord/services'
import { JWT_SECRET } from 'src/config'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'

interface CreateUserDTO {
    domains: {
        discord?: UserCreationDomainDTO
        callofduty: UserCreationDomainDTO
    }
}
interface UserCreationDomainDTO {
    domainId: string
    jwt: string
}

export namespace User {
    export namespace Schema {
      export type DomainId = 'discord' | 'callofduty' | 'pubg'
      export type Domain = { domainId: DomainId, accountId: string, model?:any }
    }
  }

@Controller('/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly discordSvcs: DiscordService,
        private readonly codAcctSvcs: CallOfDutyAccountService,
    ) {}
    @Post('/create')
    async Create(@Body() { domains }:CreateUserDTO):Promise<{ jwt: string }> {
        if (!domains?.callofduty?.jwt) {
            throw new BadRequestException('missing callofduty jwt')
        }
        for(const domainId of Object.keys(domains)) {
            const domain = domains[domainId]
            if (!domain.jwt) {
                // throw new BadRequestException(`missing jwt for domain ${domainId}`)
                continue
            }
            try {
                JWT.verify(domain.jwt, JWT_SECRET)
            } catch(e) {
                throw new UnauthorizedException(`invalid jwt for domain ${domainId}`)
            }
        }
        const { userId } = await this.userService.createUser()
        if (domains?.discord?.jwt) {
            const { id, tag, avatar } = <DiscordAuthorizationJWT>JWT.verify(domains.discord.jwt, JWT_SECRET)
            try {
                await this.discordSvcs.createAccount(userId, id, tag, avatar)
            } catch(e) {
                // discord acct already exists
            }
        }
        try {
            const { authId, unoId } = JWT.verify(domains.callofduty.jwt, JWT_SECRET) as any
            await this.codAcctSvcs.createAccountForUser(userId, authId, unoId, true)
            const jwt = await this.userService.generateJwtById(userId)
            return { jwt }
        } catch(e) {
            console.log(e)
            throw new UnauthorizedException('invalid callofduty jwt')
        }
    }
    @Post('/login')
    async Login(@Body() { jwt }):Promise<{ jwt: string }> {
        if (!jwt) {
            throw new BadRequestException('missing jwt')
        }
        try {
            const { userId } = JWT.verify(jwt, JWT_SECRET) as any
            const userJwt = await this.userService.generateJwtById(userId)
            return { jwt: userJwt }
        } catch(e) {
            throw new UnauthorizedException('invalid jwt')
        }
    }
}
