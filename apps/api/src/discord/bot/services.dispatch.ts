import * as Discord from 'discord.js'
import { Connection } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Normalize } from '@stagg/callofduty'
import { UserService } from 'src/user/services'
import { User } from 'src/user/schemas'

export namespace Dispatch {
  export type Handler = Handler.Sync | Handler.Async
  export namespace Handler {
    export type Sync = (user:any, ...args:any[]) => Output
    export type Async = (user:any, ...args:any[]) => Promise<Output>
  }
  export type Output = Output.Chunk[]
  export namespace Output {
    export type Chunk = string | { files: string[] }
  }
  export interface Map {
    _default?: Dispatch.Handler
    [key:string]: Dispatch.Handler | Map
  }
}

type InputUserMap = { [key:string]: User }

@Injectable()
export class DiscordBotRelayDispatchService {
  constructor(
    private readonly userService: UserService,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  public async dispatch(m:Discord.Message, ...chain:string[]):Promise<Dispatch.Output> {
      const user = await this.userService.fetchByDiscordId(m.author.id)
      try {
        const users = await this.inputReduceUsers(user, 'callofduty', ...chain)
        console.log('[>] Dispatcher got users', users)
        return ['tired yo']
      } catch(e) {
        return [`ERROR: ${e}`]
      }
  }
  private async inputReduceUsers(user:User, game:'callofduty', ...pids:string[]):Promise<InputUserMap> {
    const userMap:InputUserMap = {}
    if (pids.includes('me')) {
        userMap['me'] = user
    }
    const discordUsersMap = await this.inputReduceUsersFromDiscordTags(...pids)
    const gameAcctUsersMap = await this.inputReduceUsersFromGameIds(game, ...pids)
    const firstRoundUsers = { ...discordUsersMap, ...gameAcctUsersMap }
    // now remove all the pids that were found in the two methods above
    for(const pid in firstRoundUsers) {
        if (firstRoundUsers[pid]) {
            delete pids[pids.indexOf(pid)]
        }
    }
    // now reduce shortcuts if applicable, if not return current users
    if (!user?.discord?.shortcuts) {
        return { ...userMap, ...firstRoundUsers }
    }
    for(const i in pids) {
        if (user.discord.shortcuts[pids[i]]) {
            pids[i] = user.discord.shortcuts[pids[i]]
        }
    }
    // now do discord tags and game ids again
    const discordUsersMap2 = await this.inputReduceUsersFromDiscordTags(...pids)
    const gameAcctUsersMap2 = await this.inputReduceUsersFromGameIds(game, ...pids)
    const secondRoundUsers = { ...discordUsersMap2, ...gameAcctUsersMap2 }
    return { ...userMap, ...firstRoundUsers, ...secondRoundUsers }
  }
  private async inputReduceUsersFromDiscordTags(...pids:string[]):Promise<InputUserMap> {
    const userMap:InputUserMap = {}
    for (const i in pids) {
        const pid = pids[i]
        if (pid.match(/<@!([0-9]+)>/)) {
            const discordId = pid.replace(/<@!([0-9]+)>/, '$1')
            userMap[pid] = await this.userService.fetchByDiscordId(discordId)
            if (!userMap[pid]) {
              throw `${pid} is not registered`
            }
            delete pids[i]
        }
    }
    return userMap
  }
  private async inputReduceUsersFromGameIds(game:'callofduty', ...pids:string[]):Promise<InputUserMap> {
    switch(game) {
        case 'callofduty':
            return this.inputReduceUsersFromCallOfDutyIds(...pids)
        default:
            throw new Error('Invalid game specified')
    }
  }
  private async inputReduceUsersFromCallOfDutyIds(...pids:string[]):Promise<InputUserMap> {
    const playerMap:any = {}
    const queries = []
    for (const i in pids) {
        const pid = pids[i].toLowerCase()
        const index = Number(i)
        if (Object.keys(Normalize.Platforms).includes(pid)) {
            if (!pids[index - 1]) {
                // its a platform identifier with no preceding username
                throw `Unexpected platform ${pids[index]}; all platforms must be preceded by a username. (eg: \`HusKerrs uno\`)`
                // delete pids[index]
                // continue
            }
            const platform = pid
            const username = pids[index - 1]
            playerMap[pid] = await this.db_cod.collection('accounts').findOne({ [`profiles.${platform}`]: username })
            delete pids[index]
            delete pids[index - 1]
        }
    }
    // all username + platform combos are gone, now reduce remaining chunks as uno platform usernames (default)
    for (const pid of pids) {
        if (!pid) continue
        playerMap[pid] = await this.db_cod.collection('accounts').findOne({ 'profiles.uno': pid })
    }
    // reduce player game accounts to user accounts
    const userMap:InputUserMap = {}
    for(const pid in playerMap) {
        if (!playerMap[pid]) {
            continue
        }
        userMap[pid] = await this.userService.fetchByGameAccountId('callofduty', playerMap[pid]._id)
    }
    return userMap
  }
}
