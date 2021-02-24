const { writeFileSync, readFileSync } = require('fs')
const { useConfig } = require('@stagg/gcp')

function genEnvPath() {
    try {
        const { name } = JSON.parse(readFileSync(`${process.cwd()}/package.json`))
        if (name === 'stagg-app-web') {
            console.log('[&] Found web-ui root in cwd...')
            return process.cwd()
        }
    } catch(e) {}
    console.log('[&] Linking web-ui in reference to monorepo root...')
    return process.cwd() + '/applications/web-ui'
}

async function createEnvFile() {
    const config = {}
    console.log('[#] Provisioning configuration for local env...')
    await useConfig(config)
    const localEnvPath = `${genEnvPath()}/.env.local`
    console.log(`[+] Generating env at "${localEnvPath}"...`)
    writeFileSync(localEnvPath, [
        `NEXT_PUBLIC_MEMBERSHIP_PRICE_MONTH=${config.membership.price.month}`,
        `NEXT_PUBLIC_MEMBERSHIP_PRICE_YEAR=${config.membership.price.year}`,
        `NEXT_PUBLIC_HOST_API=${config.network.host.api}`,
        `NEXT_PUBLIC_HOST_DISCORD_INVITE_HELP=${config.network.host.discord.invite.help}`,
        `NEXT_PUBLIC_HOST_DISCORD_INVITE_WELCOME=${config.network.host.discord.invite.welcome}`,
        `NEXT_PUBLIC_HOST_DISCORD_OAUTH=https://discord.com/oauth2/authorize?response_type=code&scope=identify&state=&client_id=${config.discord.client.id}&redirect_uri=${config.network.host.discord.oauth.redirect}`,
        ''
    ].join('\n'))
    console.log('[$] Env generation completed successfully')
}
createEnvFile()
