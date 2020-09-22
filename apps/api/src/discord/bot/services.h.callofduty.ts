import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { User } from 'src/user/schemas'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { Dispatch } from 'src/discord/bot/services.dispatch'
import { MP, WZ } from 'src/discord/bot/queries.h.callofduty'

// User Settings > Text & Images > Show emoji reactions on messages
type HandlerParams = { user: User, users: {[key:string]: User}, params: string[] }

@Injectable()
export class DiscordBotCallOfDutyHandlerService {
  constructor(
    private readonly codService: CallOfDutyAccountService,
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  public async wzBarracks({ user, users, params }:HandlerParams):Promise<Dispatch.Output> {
    return [{ files: [`https://api.stagg.co/render/callofduty/mw/wz/barracks/user/${user._id}.png`] }]
  }
  public async statsReport({ user, users, params }:HandlerParams):Promise<Dispatch.Output> {
    const player = await this.codService.getAccountByUserId(String(user._id))
    const aggr = WZ.StatsReport(player._id, [])
    const [data] = await this.db_cod.collection('mw.wz.performances').aggregate(aggr).toArray()
    return Object.keys(data).map(dataKey => `${dataKey}: ${data[dataKey]}`)
  }
}
