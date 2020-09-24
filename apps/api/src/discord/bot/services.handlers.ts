import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { User } from 'src/user/schemas'
import { MailService } from 'src/mail/services'
import { Dispatch } from 'src/discord/bot/services.dispatch'

// User Settings > Text & Images > Show emoji reactions on messages
type HandlerParams = { authorId:string, user: User, users: {[key:string]: User}, params: string[] }

@Injectable()
export class DiscordBotHandlerService {
  constructor(
    private readonly mailService: MailService,
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
  public async confirm({ authorId, params }:HandlerParams):Promise<Dispatch.Output> {
    const [token] = params
    const userAcct = await this.db_stg.collection('users').findOne({ 'discord.confirm.id': authorId, 'discord.confirm.token': token })
    if (!userAcct) {
      throw 'Invalid confirmation code'
    }
    await this.db_stg.collection('users').updateOne({ _id: userAcct._id }, { $set: { 'discord.id': authorId }, $unset: { 'discord.confirm': null } })
    return [
      'Account confirmation successful; all game profiles linked to the associated email address are now synced to your Discord account.'
    ]
  }
  public async register({ user, authorId, params }:HandlerParams):Promise<Dispatch.Output> {
    const [email] = params
    const token = this.mailService.randomCode()
    const emailUser = await this.db_stg.collection('users').findOne({ emails: email })
    if (!emailUser) {
      throw 'Invalid email address'
    }
    if (emailUser.discord?.id) {
      if (emailUser.discord.id === authorId) {
        throw 'The associated email address is already registered to this Discord account'
      }
      throw 'The associated email address is already registered to a different Discord account'
    }
    await this.db_stg.collection('users').updateOne({ _id: emailUser._id }, { $set: { 'discord.confirm': { id: authorId, token } } })
    await this.mailService.sendDiscordCode(email, authorId, token)
    return [
      'Check the email associated with this request for your confirmation code. Reply with the confirmation code using the `confirm` command shown below.',
      '```',
      '% confirm XXXXX',
      '```',
    ]
  }
  public help():Dispatch.Output {
      return [
        '———————————————————————————',
        '**# First time users                                                                              #**',
        '———————————————————————————',
        "Don't worry, it's a painless 2-step process:",
        '1) Create your account at https://profile.callofduty.com',
        '2) Sign in with your CallOfDuty account from Step #1 at https://stagg.co/callofduty/login',
        '',
        '———————————————————————————',
        '**# Using the bot                                                                                  #**',
        '———————————————————————————',
        'If calling the bot in a text channel you will need to prefix messages with `%` or `@Stagg`; this is not necessary in DMs. Example: `% help` or `@Stagg help` will work in both text channels or DMs while `help` will work only in DMs',
        '',
        'Any command that takes `<...profile(s)>` can take profile identifiers as either Discord tags, `<username> <?platform>` input, or any mixture of those. For example, to fetch `barracks` reports for the `@DrDisrespect` Discord user and the `DanL` Xbox Live gamertag you could use this command:',
        '```',
        '% barracks @DrDisrespect DanL XBL',
        '```',
        '———————————————————————————',
        '**# Available commands                                                                             #**',
        '———————————————————————————',
        'Tip: `...` prefix means multiple params accepted and `?` prefix means optional params',
        //'- `search <username> <?platform>` Find profiles matching your query',
        '- `register <email>` Link your Discord account to your Stagg account',
        '- `shortcut <...arg(s)>` Shortcut your favorite commands',
        '- `barracks <...?mode(s)> <...?profile(s)>` Generate a barracks report',
        '... more coming soon!',
        '',
        '———————————————————————————',
        '**# Support                                                                                        #**',
        '———————————————————————————',
        'Help Guide: https://stagg.co/discord/help',
        'Stagg Discord Server: https://stagg.co/discord/join',
        'Get Stagg on your server: https://stagg.co/discord/integrate',
      ]
  }
}
