import * as JWT from 'jsonwebtoken'
import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    BadRequestException
} from '@nestjs/common'
import { UserService } from 'src/user/services'
import { JWT_SECRET } from 'src/config'

@Controller('/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}
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