import cfg from 'config/ui'
import { API } from '.'

export type DiscordFileOutput = { files: string[] }
export type DiscordReactionOutput = { reactions: string[] }
export type DiscordCombinedOutput = DiscordFileOutput & DiscordReactionOutput
export type DiscordOutputChunk = string | DiscordFileOutput | DiscordReactionOutput | DiscordCombinedOutput
export type DiscordOutput = DiscordOutputChunk[]
export const simCommand = async (...chain:string[]):Promise<DiscordOutput> => {
    const { response } = await API.Get<DiscordOutput>(`/discord/cmd/${cfg.discord.sim.userId}/${chain.join('/')}`)
    return response
}
export const exchangeToken = async (accessToken:string):Promise<any> => {
    return API.Get<{ jwt:string }>(`/discord/oauth/exchange/${accessToken}`)
}
