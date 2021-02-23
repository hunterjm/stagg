import { getConfigJson, getEnvSecret } from '@stagg/gcp'
export const IS_DEV = process.env.NODE_ENV === 'development'

export const PORT = IS_DEV ? 8200 : Number(process.env.PORT) || 8080

export const CONFIG = <{
    host: { self:string, web:string, api:string, bot:string, etl: { discord: { role: string }, account:string, cheaters:string } }
    bot: {
        ranking: { limit: string, skip: string }
        channels: { reporting: { public: string, private: string } }
        messages: { welcome:string, invalid:string, unregistered:string, help:string, loading:string, ready:string }
    }
}>{}
export const SECRETS = <any>{ NETWORK_KEY: '' }
export const initializeConfig = async () => {
    SECRETS.NETWORK_KEY = await getEnvSecret('NETWORK_KEY')
    const cfg = await getConfigJson('functions-event-handler.json')
    for(const key in cfg) {
        CONFIG[key] = cfg[key]
    }
}
