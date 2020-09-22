import { Connection } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Normalize } from '@stagg/callofduty'
import { UserService } from 'src/user/services'
import { User } from 'src/user/schemas'
import { DiscordBotHandlerService } from 'src/discord/bot/services.handlers'
import { DiscordBotCallOfDutyHandlerService } from 'src/discord/bot/services.h.callofduty'

export namespace Dispatch {
  export type Handler = Handler.Sync | Handler.Async
  export namespace Handler {
    export type Sync = (user:any, ...args:any[]) => Output
    export type Async = (user:any, ...args:any[]) => Promise<Output>
  }
  export type Output = Output.Chunk[]
  export namespace Output {
    export type Files = { files:string[] }
    export type Reactions = { reactions:string[] }
    export type CombinedAttachments = Files & Reactions
    export type Chunk = string | Files | Reactions | CombinedAttachments
  }
  export interface Map {
    _default?: Dispatch.Handler
    [key:string]: Dispatch.Handler | Map
  }
}

type InputUserMap = { [key:string]: User }

@Injectable()
export class DiscordBotDispatchService {
  constructor(
    private readonly userService: UserService,
    private readonly handlerService: DiscordBotHandlerService,
    private readonly codHandler: DiscordBotCallOfDutyHandlerService,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  private get dispatchTree() {
    // Root tree defines all functionality
    const root = {
      help: this.handlerService.help.bind(this.handlerService),
      shortcut: this.handlerService.shortcut.bind(this.handlerService),
      barracks: this.codHandler.wzBarracks.bind(this.codHandler),
      report: {
        cod: {
          mw: {
            wz: {
              all: this.codHandler.statsReport.bind(this.codHandler),
              barracks: this.codHandler.wzBarracks.bind(this.codHandler),
            }
          }
        }
      }
    }
    // Alias tree defines shortcuts and aliases to use with the root tree for better UX
    const alias = {
      helpme: root.help,
    }
    return { ...alias, ...root }
  }
  private dispatchTreeKeys(search:string|Function) { // was going to use this for keyword prevention in shortcuts...
    const handlerFunction = typeof search === typeof 'str' ? this.dispatchTree[search as string] : search
  }
  public async dispatch(user:User, ...chain:string[]):Promise<Dispatch.Output> {
      try {
        this.handlerService.shortcut({ user, users: {}, params: ['delete', 'hh']})
        const { output, input } = this.inputReduceCmds(user?.discord?.shortcuts, ...chain)
        const users = chain[0] === 'shortcut' ? {} : await this.inputReduceUsers(user, 'callofduty', ...input)
        const remainingParams = input.filter(chunk => !Object.keys(users).includes(chunk))
        const o = await output({ user, users, params: remainingParams })
        return o
      } catch(e) {
        return [`ERROR: ${e}`]
      }
  }
  private inputReduceCmds(shortcuts:any, ...chain:string[]):{ output: Function, input: string[]} {
    let dispatcher:any = this.dispatchTree
    let lastDispatcherIndex = 0
    let hydratedChain = [...chain]
    if (shortcuts && chain[0] !== 'shortcut') { // if they're currently modifying shortcuts dont hydrate
      hydratedChain = [...chain.map(chunk => shortcuts[chunk] || chunk)]
      hydratedChain = hydratedChain.join(' ').replace(/\s+/g, ' ').split(' ').filter(str => str)
    }
    for(const i in hydratedChain) {
        const child = hydratedChain[i].toLowerCase()
        if (dispatcher[child]) {
            dispatcher = dispatcher[child]
            lastDispatcherIndex = Number(i)
            continue
        }
        const strippedChild = child.replace(/s$/i, '')
        if (dispatcher[strippedChild] || dispatcher['_default']) {
            lastDispatcherIndex = Number(i) - 1
            dispatcher = dispatcher[strippedChild] ? dispatcher[strippedChild] : dispatcher['_default']
        }
    }
    if (!dispatcher || typeof dispatcher !== 'function') {
        console.log('Cannot find dispatcher', lastDispatcherIndex)
        return null
    }
    return { output: dispatcher, input: [...hydratedChain.slice(lastDispatcherIndex+1)] }
  }
  private async inputReduceUsers(user:User, game:'callofduty', ...pids:string[]):Promise<InputUserMap> {
    const userMap:InputUserMap = {}
    if (pids.includes('me')) {
        userMap['me'] = user
    }
    const discordUsersMap = await this.inputReduceUsersFromDiscordTags(...pids)
    const gameAcctUsersMap = await this.inputReduceUsersFromGameIds(game, ...pids)
    return { ...userMap, ...discordUsersMap, ...gameAcctUsersMap }
  }
  private async inputReduceUsersFromDiscordTags(...pids:string[]):Promise<InputUserMap> {
    const userMap:InputUserMap = {}
    for (const i in pids.filter(pid => pid)) {
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
