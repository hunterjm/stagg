import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Normalize } from '@stagg/callofduty'
import { Injectable } from '@nestjs/common'
import { User } from 'src/user/schemas'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { Dispatch } from 'src/discord/bot/services.dispatch'
import { MP, WZ } from 'src/callofduty/mw/discord/queries'
import { SELF_HOST } from 'src/config'

// User Settings > Text & Images > Show emoji reactions on messages
type HandlerParams = { user: User, users: {[key:string]: User}, params: string[] }

@Injectable()
export class MwDiscordService {
  constructor(
    private readonly codService: CallOfDutyAccountService,
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  public async search({ user, users, params }:HandlerParams):Promise<Dispatch.Output> {
    const [username, platform] = params as any
    if (!username || username.length < 3) {
        throw 'Enter at least 3 characters you lazy turd...' 
    }
    const results = await this.codService.searchAccount(platform, username, 'mw')
    if (!results || !results.length) {
      return ['No results...']
    }
    return [
      'Results:',
      '```',
      ...results.map(r => `${r.username} (${r.platform})`),
      '```',
    ]
  }
  public async wzBarracks({ user, users, params }:HandlerParams):Promise<Dispatch.Output> {
    const usersArr = Object.values(users)
    const files = !usersArr?.length
      ? [`${SELF_HOST}/render/callofduty/mw/wz/barracks/user/${user._id}.png`]
      : [...usersArr.map(u => `${SELF_HOST}/render/callofduty/mw/wz/barracks/user/${u._id}.png`)]
    return [{ files }]
  }
  public async statsReport({ user, users, params }:HandlerParams):Promise<Dispatch.Output> {
    const player = await this.codService.getAccountByUserId(String(user._id))
    const aggr = WZ.StatsReport(player._id, [])
    const [data] = await this.db_cod.collection('mw.wz.performances').aggregate(aggr).toArray()
    return Object.keys(data).map(dataKey => `${dataKey}: ${data[dataKey]}`)
  }
}
