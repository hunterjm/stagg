const isDev = process.env.NODE_ENV === 'development';
const discordClientId = isDev ? '738240182670589993' : '723179755548967027';
const selfUrl = isDev ? 'http://localhost:8080' : 'https://stagg.co';
const uiConfig = {
  api: {
    // host: isDev ? 'http://localhost:8081' : 'https://api.stagg.co'
    host: 'https://api.stagg.co',
  },
  discord: {
    client: {
      id: discordClientId,
    },
    sim: {
      userId: isDev ? '5f66c6a7aa7cd12e9c06e0d1' : '5f162e2abb766c451fe0f583',
    },
    url: {
      bot: `https://discord.com/oauth2/authorize?client_id=${discordClientId}&scope=bot&permissions=67584`,
      join: 'https://discord.gg/WhWrbY8',
      oauth: `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(
        selfUrl + '/oauth/discord'
      )}&response_type=code&scope=identify`,
    },
  },
  games: [
    {
      icon: 'icon-pubg',
      id: 'pubg',
      name: 'PUBG',
      supported: '',
    },
    {
      icon: 'icon-callofduty',
      id: 'callofduty',
      name: 'Call of Duty',
      supported: 'Black Ops: Cold War, Modern Warfare, and Black Ops 4',
    },
    {
      icon: 'icon-csgo',
      id: 'csgo',
      name: 'CS:GO',
      supported: '',
    },
    {
      icon: 'icon-fortnite',
      id: 'fortnite',
      name: 'Fortnite',
      supported: '',
    },
  ],
};

export default uiConfig;
