import { getEnvSecret, getConfigJson } from '@stagg/gcp'

export const IS_DEV = process.env.NODE_ENV === 'development'
export const PORT = IS_DEV ? 8300 : Number(process.env.PORT) || 8080

export const CONFIG = {
    API_HOST: '',
    TIER_NAMES: [],
    TIER_COLORS: [],
}
export const SECRETS = {
    DISCORD_CLIENT_TOKEN: '',
}
export const initializeConfig = async () => {
    const { API_HOST, TIER_NAMES, TIER_COLORS } = await getConfigJson('functions-etl-discord-role.json')
    CONFIG.API_HOST = API_HOST
    CONFIG.TIER_NAMES = TIER_NAMES
    CONFIG.TIER_COLORS = TIER_COLORS
    SECRETS.DISCORD_CLIENT_TOKEN = await getEnvSecret('DISCORD_CLIENT_TOKEN')
}
