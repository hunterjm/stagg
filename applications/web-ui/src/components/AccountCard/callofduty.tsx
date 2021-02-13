import { Model } from '@stagg/api'
import { useSelector, useDispatch } from 'react-redux'
import { Games } from '@callofduty/assets'
import { State } from 'src/redux/store'
import { AccountCard } from 'src/components/AccountCard'

const GAME_ICONS = {
    mw: 'mw',
    cw: 'bo',
    bo4: 'bo',
}
const PLATFORM_ICONS = {
    'xbl': 'xbox',
    'psn': 'playstation',
    'uno': 'activision',
    'battle': 'battlenet',
}
export const AccountCardCallOfDuty = () => {
    const dispatch = useDispatch()
    const accountState = useSelector<State,Model.Account>(state => state?.account)
    const accountProvisionState = useSelector<State,Model.Account.CallOfDuty>(state => state?.accountProvision?.callofduty)
    const account =  accountState?.callofduty || accountProvisionState
    const availableGames = account?.games?.filter(g => g === 'mw' || g === 'cw')
    const games = []
    if (availableGames?.length) {
        for(const gameId of availableGames) {
            games.push({
                name: Games[gameId].name,
                icon: `icon-callofduty-${GAME_ICONS[gameId]}`
            })
        }
    }
    const profiles = []
    if (account?.profiles?.length) {
        for(const profile of account.profiles.sort((a,b) => a.username.length - b.username.length)) {
            profiles.push({
                name: profile.username,
                icon: `icon-${PLATFORM_ICONS[profile.platform]}`,
            })
        }
    }
    return (
        <AccountCard
            games={games}
            profiles={profiles}
            providerName="Call of Duty"
            providerIcon="icon-callofduty-c"
            authorizeUrl="/callofduty/authorize"
            locked={Boolean(accountState?.id)}
            deauthorize={() => dispatch({ type: 'PROVISIONED_CALLOFDUTY', payload: undefined })}
            permissions={[
                'Access your profile',
                'Access your match history'
            ]}
        />
    )
}
