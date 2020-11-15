import Cookies from 'js-cookie'
import * as store from 'src/store'
import { AccountBox } from './AccountBox'

const gameInfo = {
    bo4: {
        icon: 'bo4',
        name: 'Black Ops 4',
    },
    mw: {
        icon: 'mw',
        name: 'Modern Warfare',
    },
    bocw: {
        icon: 'bo',
        name: 'Black Ops: Cold War',
    }
}

const platformInfo = {
    xbl: {
        icon: 'xbox',
        name: 'XBOX',
    },
    psn: {
        icon: 'playstation',
        name: 'PlayStation',
    },
    steam: {
        icon: 'steam',
        name: 'Steam',
    },
    battle: {
        icon: 'battlenet',
        name: 'Battle.net',
    },
    uno: {
        icon: 'battlenet',
        name: 'Activision',
    },
}

export const CallOfDutyAccount = () => {
    const storeUserState = store.useState(store.userState)
    const userState = storeUserState.get()
    const { games, profiles } = userState.oauth?.callofduty || {}
    const removeAcct = () => {
      storeUserState.set(state => ({
          ...state,
          oauth: {
              ...state.oauth,
              callofduty: null
          }
      }))
      Cookies.remove('jwt.callofduty')
    }
    return (
        <AccountBox>
            <div className="branding">
                <i className="icon-callofduty-c filled" />
                <h6>Call of Duty</h6>
            </div>
            <div className="permissions">
                <h6>PERMISSIONS</h6>
                <ul>
                    <li><i className="icon-discord-check" /> Access your profile</li>
                    <li><i className="icon-discord-check" /> Access your match history</li>
                </ul>
            </div>
            {
                !profiles?.length ? null : (
                    <>
                    <div className="profiles">
                        <h6>GAMES</h6>
                        {
                            games?.map((gameId:string) => (
                                <i key={gameId} className={`icon-callofduty-${gameInfo[gameId]?.icon}`} title={gameInfo[gameId]?.name} />
                            ))
                        }
                    </div>
                    <div className="platforms">
                        <h6>PROFILES</h6>
                        {
                            profiles?.filter(({ platform }) => platform !== 'battle')
                                .map(({ username, platform }) => {
                                    if (!platformInfo[platform]) {
                                        console.log('No info for platform', platform)
                                        return null
                                    }
                                    const [actualUsername] = username.split('#')
                                    return (
                                        <div key={`${platform}:${username}`}>
                                            <i className={`icon-${platformInfo[platform].icon}`} title={platformInfo[platform].name} />
                                            {actualUsername}
                                        </div>
                                    )
                                })
                        }
                    </div>
                    </>
                )
            }
            {
              profiles?.length ? (
                <div className="action remove" onClick={removeAcct} />
              ) : (
                <a href="/oauth/callofduty" className="action add" />
              )
            }
        </AccountBox>
    )
}
