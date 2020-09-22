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
import { WZ, MP } from 'src/discord/bot/queries.h.callofduty'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { FAAS_URL } from 'src/config'
import { Normalize } from '@stagg/callofduty'

@Controller('/render')
export class RenderController {
    constructor(
        private readonly codAcctService: CallOfDutyAccountService,
        @InjectConnection('callofduty') private db_cod: Connection,
    ) {}
    @Get('/callofduty/mw/wz/barracks/user/:userId.png')
    async Barracks(@Req() req, @Res() res, @Param() { userId }):Promise<any> {
        req.headers['content-type'] = 'application/json'
        const player = await this.codAcctService.getAccountByUserId(userId)
        if (!player) {
            throw new BadRequestException('no game account for this user')
        }
        const weaponAggr = MP.WeaponStats(player._id, [])
        const [weaponData] = await this.db_cod.collection('mw.mp.performances').aggregate(weaponAggr).toArray()
        const weaponStats:any = {}
        for(const key in weaponData) {
            const [statKey, weaponId] = key.split('__')
            const [parentKey, childKey] = statKey.split('_')
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

        const aggr = WZ.Barracks(player._id, [])
        const [data] = await this.db_cod.collection('mw.wz.performances').aggregate(aggr).toArray()

        deprecatedRequest({
            json: true,
            url: `${FAAS_URL.RENDER_HTML}?v=cod.mw.wz.barracks`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                weaponId: weaponOfChoice,
                weaponName: Normalize.MW.Weapons[weaponOfChoice].name,
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