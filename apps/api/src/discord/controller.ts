import * as Discord from 'discord.js'
import { Controller, Get, Put, Param, Headers, Res, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/services'
import { DiscordService } from 'src/discord/services'
import { AccountDAO } from 'src/discord/entity'
import { Dispatch } from 'src/discord/bot/services.dispatch'
import { DISCORD } from 'src/config'

@Controller('/discord')
export class DiscordController {
    constructor(
        private readonly acctDao: AccountDAO,
        private readonly userService: UserService,
        private readonly discordService: DiscordService,
    ) {}
    @Get('/health')
    async HealthCheck():Promise<string> {
        return 'ok'
    }
    @Get('/join')
    async Join(@Res() res):Promise<void> {
        res.redirect(DISCORD.SERVER.INVITE)
    }
    @Get('/guilds')
    async Guilds():Promise<Discord.Guild[]> {
        return this.discordService.client.guilds.cache.array()
    }
    @Get('/guilds/:guildId')
    async GuildById(@Param() { guildId }):Promise<Discord.Guild> {
        return this.discordService.client.guilds.cache.get(guildId)
    }
    @Get('/guilds/:guildId/owner')
    async GuildOwnerById(@Param() { guildId }):Promise<Discord.GuildMember> {
        return this.discordService.client.guilds.cache.get(guildId).owner
    }
    @Get('/guilds/:guildId/roles')
    async GuildRolesById(@Param() { guildId }):Promise<Discord.Role[]> {
        return this.discordService.client.guilds.cache.get(guildId).roles.cache.array()
    }
    @Get('/guilds/:guildId/members')
    async GuildMembersById(@Param() { guildId }):Promise<Discord.GuildMember[]> {
        return this.discordService.client.guilds.cache.get(guildId).members.cache.array()
    }
    @Put('/oauth/exchange/:accessToken')
    async ExchangeAccessToken(@Headers() headers, @Param() { accessToken }):Promise<{ success: boolean }> {
        const jwt = this.userService.getJwtPayload(headers)
        if (!jwt) {
            throw new UnauthorizedException('unauthorized')
        }
        const discordUser = await this.discordService.exchangeAccessToken(accessToken)
        console.log('New Discord Account:', {
            ...discordUser,
            userId: jwt.user.userId,
        })
        await this.acctDao.insert({
            ...discordUser,
            userId: jwt.user.userId,
        })
        return { success: true }
    }
    @Get('/cmd/:userId/*')
    async SimulateBotCommand(@Param() params):Promise<Dispatch.Output> {
        const { userId } = params
        delete params.userId
        const user = await this.userService.fetchById(userId)
        if (!user) {
            throw new BadRequestException('user does not exist')
        }
        const [chainSlashed] = Object.values(params) as string[]
        const chain = chainSlashed.split('/')
        return this.discordService.triggerBotCommand(user, ...chain)
    }
}