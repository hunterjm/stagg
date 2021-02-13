export const IS_DEV = process.env.NODE_ENV === 'development'

export const API_URL = IS_DEV ? 'http://localhost:8081' : 'https://api.stagg.co'

export const DISCORD_JOIN_URL = 'https://discord.gg/WhWrbY8'
export const DISCORD_JOIN_HELP_URL = 'https://discord.gg/ZufxAuPDet'
export const DISCORD_OAUTH_URL = IS_DEV
    ? 'https://discord.com/api/oauth2/authorize?client_id=738240182670589993&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fdiscord%2Foauth&response_type=code&scope=identify'
    : 'https://discord.com/oauth2/authorize?client_id=723179755548967027&redirect_uri=https%3A%2F%2Fstagg.co%2Fdiscord%2Foauth&response_type=code&scope=identify&state='
export const PRICING_INDIVIDUAL = 1 // DOLLARS PER MONTH
