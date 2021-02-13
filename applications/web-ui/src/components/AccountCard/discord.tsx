import { Model } from '@stagg/api'
import { useSelector, useDispatch } from 'react-redux'
import { AccountCard } from 'src/components/AccountCard'
import { DISCORD_OAUTH_URL } from 'config/ui'
import { State } from 'src/redux/store'

export const AccountCardDiscord = () => {
    const dispatch = useDispatch()
    const accountState = useSelector<State,Model.Account>(state => state?.account)
    const accountProvisionState = useSelector<State,Model.Account.Discord>(state => state?.accountProvision?.discord)
    const account =  accountState?.discord || accountProvisionState
    const profiles = []
    if (account?.id) {
        profiles.push({
            name: account?.tag,
            icon: account?.avatar 
                ? `https://cdn.discordapp.com/avatars/${account?.id}/${account?.avatar}.png`
                : '/assets/images/none.avatar.jpg',
        })
    }
    return (
        <AccountCard
            profiles={profiles}
            providerName="Discord"
            providerIcon="icon-discord"
            locked={Boolean(accountState?.id)}
            authorizeUrl={ DISCORD_OAUTH_URL }
            deauthorize={() => dispatch({ type: 'PROVISIONED_DISCORD', payload: undefined })}
            permissions={[
                'Send you messages and invites',
                'Access your username and avatar'
            ]}
        />
    )
}
