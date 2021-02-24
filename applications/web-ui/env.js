const { writeFileSync } = require('fs')
const { useConfig } = require('@stagg/gcp')

async function createEnvFile() {
    const config = {}
    await useConfig(config)
    writeFileSync(`${process.cwd()}/.env.local`, [
        `NEXT_PUBLIC_MEMBERSHIP_PRICE_MONTH=${config.membership.price.month}`,
        `NEXT_PUBLIC_MEMBERSHIP_PRICE_YEAR=${config.membership.price.year}`,
        `NEXT_PUBLIC_HOST_API=${config.network.host.api}`,
        `NEXT_PUBLIC_HOST_DISCORD_INVITE_HELP=${config.network.host.discord.invite.help}`,
        `NEXT_PUBLIC_HOST_DISCORD_INVITE_WELCOME=${config.network.host.discord.invite.welcome}`,
        `NEXT_PUBLIC_HOST_DISCORD_OAUTH=https://discord.com/oauth2/authorize?response_type=code&scope=identify&state=&client_id=${config.discord.client.id}&redirect_uri=${config.network.host.discord.oauth.redirect}`,
        ''
    ].join('\n'))
}
createEnvFile()
