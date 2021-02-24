const { writeFileSync, readFileSync } = require('fs')
const { useConfig } = require('@stagg/gcp')

function genEnvPath() {
    try {
        const { name } = JSON.parse(readFileSync(`${process.cwd()}/package.json`))
        if (name === 'stagg-app-web') {
            return process.cwd()
        }
    } catch(e) {}
    return process.cwd() + '/applications/web-ui'
}

async function createEnvFile() {
    const config = {}
    await useConfig(config)
    console.log(`[+] Generating env at "${genEnvPath()}/.env.local"`)
    writeFileSync(`${genEnvPath()}/.env.local`, [
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
