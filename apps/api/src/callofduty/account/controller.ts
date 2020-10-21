import { Schema } from '@stagg/callofduty'
import {
    Controller,
    Get,
    Put,
    Post,
    Body,
    Param,
    Delete,
    NotFoundException,
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common'
import { AccountDAO } from 'src/callofduty/account/entity'
import { PGSQL } from 'src/config'

@Controller('callofduty/account')
export class CallOfDutyAccountController {
    constructor(
        private readonly acctDao: AccountDAO
    ) {}

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
}
