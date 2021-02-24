export const config = {
    membership: {
        price: {
            year: Number(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE_YEAR),
            month: Number(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE_MONTH),
        }
    },
    network: {
        host: {
            api: process.env.NEXT_PUBLIC_HOST_API,
            discord: {
                oauth: {
                    authorize: process.env.NEXT_PUBLIC_HOST_DISCORD_OAUTH
                },
                invite: {
                    help: process.env.NEXT_PUBLIC_HOST_DISCORD_INVITE_HELP,
                    welcome: process.env.NEXT_PUBLIC_HOST_DISCORD_INVITE_WELCOME,
                }
            }
        }
    }
}
