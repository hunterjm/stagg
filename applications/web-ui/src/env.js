const { writeFileSync } = require('fs')
const { useConfig } = require('@stagg/gcp')

async function run() {
    const config = {}
    await useConfig(config)
    writeFileSync(`${process.cwd()}/.env.local`, [
        `NEXT_PUBLIC_HOST_API=${config.network.host.api}`,
        `NEXT_PUBLIC_HOST_DISCORD_INVITE_HELP=${config.network.host.api}`,
        `NEXT_PUBLIC_HOST_DISCORD_INVITE_WELCOME=${config.network.host.api}`,
        `NEXT_PUBLIC_HOST_DISCORD_OAUTH=https://discord.com/oauth2/authorize?response_type=code&scope=identify&state=&client_id=${config.discord.client.id}&redirect_uri=${config.host.discord.oauth.redirect}`,
    ].join('\n'))
}
run()
