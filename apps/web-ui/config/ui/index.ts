export default {
    delay: {
        forward: 1500,
        uploading: 5000,
    },
    api: {
        host: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'https://api.stagg.co'
    },
    upload: {
        ready: {
            ratio: 0.5,
            total: 100,
        }
    },
    discord: {
        url: {
            join: 'https://discord.gg/WhWrbY8',
            bot: 'https://discord.com/oauth2/authorize?client_id=723179755548967027&scope=bot&permissions=67584',
        },
        sim: {
            userId: process.env.NODE_ENV === 'development' ? '5f66c6a7aa7cd12e9c06e0d1' : '5f162e2abb766c451fe0f583'
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
            supported: 'Warzone & Multiplayer for Modern Warfare & Black Ops 4',
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
