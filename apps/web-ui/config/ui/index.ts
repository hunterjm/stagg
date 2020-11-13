const isDev = process.env.NODE_ENV === 'development'
const discordClientId = isDev ? '738240182670589993' : '723179755548967027'
const selfUrl = isDev ? 'http://localhost:8080' : 'https://stagg.co'
export default {
    api: {
        host: isDev ? 'http://localhost:8081' : 'https://api.stagg.co'
    },
    discord: {
        client: {
            id: discordClientId
        },
        url: {
            join: 'https://discord.gg/WhWrbY8',
            bot: `https://discord.com/oauth2/authorize?client_id=${discordClientId}&scope=bot&permissions=67584`,
            oauth: `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(selfUrl + '/oauth/discord')}&response_type=code&scope=identify`,
        },
        sim: {
            userId: isDev ? '5f66c6a7aa7cd12e9c06e0d1' : '5f162e2abb766c451fe0f583'
        }
    },
    games: [
        {
            id: 'pubg',
            name: 'PUBG',
            icon: 'icon-pubg',
            supported: '',
        },
        {
            id: 'callofduty',
            name: 'Call of Duty',
            icon: 'icon-callofduty',
            supported: 'Black Ops: Cold War, Modern Warfare, and Black Ops 4',
        },
        {
            id: 'csgo',
            name: 'CS:GO',
            icon: 'icon-csgo',
            supported: '',
        },
        {
            id: 'fortnite',
            name: 'Fortnite',
            icon: 'icon-fortnite',
            supported: '',
        }
    ],
}
