import { Account } from '@stagg/db'
import { Model } from '@stagg/api'
export const denormalizeAccount = (account:Account.Entity):Model.Account => {
    const profiles = []
    if (account.callofduty_uno_username) {
        profiles.push({ platform: 'uno', username: account.callofduty_uno_username })
    }
    if (account.callofduty_xbl_username) {
        profiles.push({ platform: 'xbl', username: account.callofduty_xbl_username })
    }
    if (account.callofduty_psn_username) {
        profiles.push({ platform: 'psn', username: account.callofduty_psn_username })
    }
    if (account.callofduty_battle_username) {
        profiles.push({ platform: 'battle', username: account.callofduty_battle_username })
    }
    return {
        id: account.account_id,
        discord: {
            id: account.discord_id,
            tag: account.discord_tag,
            avatar: account.discord_avatar,
        },
        callofduty: {
            unoId: account.callofduty_uno_id,
            games: account.callofduty_games,
            profiles,
        },
    }
}


// cleanup services and scraper (finish sibling process) and maybe db connections for microservices