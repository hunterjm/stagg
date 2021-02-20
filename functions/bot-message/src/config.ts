import { getEnvSecret } from '@stagg/gcp'

export const IS_DEV = process.env.NODE_ENV === 'development'
export const PORT = IS_DEV ? 8400 : Number(process.env.PORT) || 8080

export const SECRETS = {
    DISCORD_CLIENT_TOKEN: '',
}
export const initializeConfig = async () => {
    SECRETS.DISCORD_CLIENT_TOKEN = await getEnvSecret('DISCORD_CLIENT_TOKEN')
}
