import * as ordinal from 'ordinal'
import * as deprecatedRequest from 'request'
import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import {
    Req,
    Res,
    Get,
    Param,
    Controller,
    BadRequestException
} from '@nestjs/common'
import { WZ, MP } from 'src/callofduty/mw/discord/queries'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { Schema, Normalize } from '@stagg/callofduty'
import { FAAS } from 'src/config'

@Controller('/render')
export class RenderController {
    constructor(
        private readonly codAcctService: CallOfDutyAccountService,
        @InjectConnection('callofduty') private db_cod: Connection,
    ) {}
    @Get('/callofduty/mw/wz/barracks/account/:accountId.png')
    async NewBarracks(@Req() req, @Res() res, @Param() { accountId }):Promise<any> {

    }
    @Get('/callofduty/mw/wz/barracks/user/:userId.png')
    async Barracks(@Req() req, @Res() res, @Param() { userId }):Promise<any> {
        req.headers['content-type'] = 'application/json'
        const acct = await this.codAcctService.getAccountByUserId(userId)
        if (!acct) {
            throw new BadRequestException('no game account for this user')
        }
        const weaponStats:any = {}
        const weaponAggr = MP.WeaponStats(acct._id, [])
        const [weaponData] = await this.db_cod.collection('mw.mp.match.records').aggregate(weaponAggr).toArray()
        for(const key in weaponData) {
            const [statKey, weaponId] = key.split('__')
            const [parentKey, childKey] = statKey.split('_')
            if (!weaponId) {
                continue
            }
            if (!weaponStats[weaponId]) {
                weaponStats[weaponId] = {}
            }
            if (!childKey) {
                weaponStats[weaponId][statKey] = weaponData[key]
            } else {
                if (!weaponStats[weaponId][parentKey]) {
                    weaponStats[weaponId][parentKey] = {}
                }
                weaponStats[weaponId][parentKey][childKey] = weaponData[key]
            }
        }

        const mostKillsWithAnyWeapon = Math.max(...Object.values(weaponStats).map((stats:any) => stats.kills).filter(n => n))
        const weaponOfChoice = Object.keys(weaponStats).find(key => weaponStats[key].kills === mostKillsWithAnyWeapon)

        const actualBrModes:any = Object.keys(Normalize.MW.Modes).filter(mid => !mid.includes('dmz') && !mid.includes('tmd') && !mid.includes('mini'))
        const aggr = WZ.Barracks(acct._id, actualBrModes)
        const [data] = await this.db_cod.collection('mw.wz.match.records').aggregate(aggr).toArray()

        const weaponName = Normalize.MW.Weapons[weaponOfChoice] ? Normalize.MW.Weapons[weaponOfChoice].name : weaponOfChoice

        deprecatedRequest({
            json: true,
            url: `${FAAS.RENDER_HTML}?v=cod.mw.wz.barracks`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                weaponId: weaponOfChoice,
                weaponName,
                weaponKills: mostKillsWithAnyWeapon,
                totalWins: data.wins,
                totalGames: data.games,
                timePlayed: data.timePlayed,
                avgFinish: Math.round(data.teamPlacement/data.games),
                avgFinishOrdinal: ordinal.indicator(Math.round(data.teamPlacement/data.games)),
                top10Percentage: (data.top10/data.games) * 100,
                gulagWinPercentage: (data.gulagWins/data.gulagGames) * 100,
                totalRevives: data.revives,
                timeMovingPercentage: data.percentTimeMoving/data.games,
                totalFinalCircles: data.finalCircles,
                damagePerGame: data.damageDone/data.games,
                bestKillstreak: data.bestKills,
                killsPerGame: data.kills/data.games,
                killsPerDeath: data.kills/data.deaths,
                damageDonePerDamageTaken: data.damageDone/data.damageTaken,
                scorePerMin: data.score/(data.timePlayed/60)
            }
        }).pipe(res)
    }
}