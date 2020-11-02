import * as JWT from 'jsonwebtoken'
import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common'
import { UserService } from 'src/user/services'
import { UserDAO } from 'src/user/entity'
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
@Controller('/user')
export class UserController {
    constructor(
        private readonly userDao: UserDAO,
        private readonly userService: UserService,
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
                throw new BadRequestException(`missing jwt for domain ${domainId}`)
            }
            try {
                JWT.verify(domain.jwt, JWT_SECRET)
            } catch(e) {
                throw new UnauthorizedException(`invalid jwt for domain ${domainId}`)
            }
        }
        const { userId } = await this.userService.createUser()
        if (domains?.discord?.jwt) {
            const decodedDiscordDetails = JWT.verify(domains.discord.jwt, JWT_SECRET)
            // await this
        }
        try {
            const { authId } = JWT.verify(domains.callofduty.jwt, JWT_SECRET) as any
            const newCodAcct = await this.codAcctSvcs.createAccount(userId, authId, true)
            const jwt = await this.userService.generateJwtById(userId)
            return { jwt }
        } catch(e) {
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