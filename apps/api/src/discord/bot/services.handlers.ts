import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { User } from 'src/user/schemas'
import { Dispatch } from 'src/discord/bot/services.dispatch'

// User Settings > Text & Images > Show emoji reactions on messages
type HandlerParams = { user: User, users: {[key:string]: User}, params: string[] }

@Injectable()
export class DiscordBotHandlerService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
  ) {}
  public async shortcut({ user, users, params }:HandlerParams):Promise<Dispatch.Output> {
    const [shortcutKey, ...shortcutValue] = params
    if (shortcutKey === 'delete') {
      const [keyToDel] = shortcutValue
      await this.db_stg.collection('users').updateOne({ _id: user._id }, { $unset: { [`discord.shortcuts.${keyToDel}`]: '' } })
      return [`Shortcut \` ${keyToDel} \` deleted`]
    }
    await this.db_stg.collection('users').updateOne({ _id: user._id }, { $set: { [`discord.shortcuts.${shortcutKey}`]: shortcutValue.join(' ') } })
    return [`Shortcut \` ${shortcutKey} \` set to \` ${shortcutValue.join(' ')} \``]
  }
  public help():Dispatch.Output {
      return [
        '———————————————————————————',
        '**# First time users                                                                              #**',
        '———————————————————————————',
        'Getting started is an easy 3-step process:',
        '1) Create your account at https://profile.callofduty.com',
        '2) Sign in with your CallOfDuty account from Step #1 at https://stagg.co/login',
        '3) Relax while your match history is collected and try some of the commands below',
        '',
        '———————————————————————————',
        '**# Using the bot                                                                                  #**',
        '———————————————————————————',
        'If calling the bot in a text channel you will need to prefix messages with `%` or `@Stagg`; this is not necessary in DMs.',
        '',
        'Example:',
        '```',
        '% wz all HusKerrs',
        '```',
        'Available commands:',
        '- `search <username> <platform?>` Find profiles matching your query',
        '- `register <email> OR <username> <platform>` Link your Discord',
        '- `shortcut <...arg(s)>` Shortcut your favorite commands',
        '- `wz all <username> <platform?>` Show all aggregated BR stats',
        '- `wz solos <username> <platform?>` Aggregated stats from all BR Solos matches',
        '- `wz duos <username> <platform?>` Aggregated stats from all BR Duos matches',
        '- `wz trios <username> <platform?>` Aggregated stats from all BR Trios matches',
        '- `wz quads <username> <platform?>` Aggregated stats from all BR Quads matches',
        '- `wz combined <username> <platform?>` Aggregated stats from all BR modes',
        '- `wz chart <stat> <uno>` Stats can be isolated (eg: `kills`) or ratios (eg: `kills/deaths`)',
        '',
        'To see the full list of available stats, use cmd `stats`',
        '',
        'To see the full list of default values (eg: `<platform?>`), use cmd `defaults`',
        '',
        'Additional support may be provided on an as-needed basis in the Stagg Discord server: https://discord.gg/WhWrbY8',
        '',
        'If you want this humble binary buck in your server, click the link below:',
        'https://discord.com/oauth2/authorize?client_id=723179755548967027&scope=bot&permissions=67584',]
  }
}
