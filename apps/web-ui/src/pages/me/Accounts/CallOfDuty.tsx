import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { AccountBox } from './AccountBox'
import { getUser } from 'src/hooks/getUser'

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
    const [user, setUser] = useState(null)
    const [added, setAdded] = useState(false)
    const { accounts: { callofduty } } = user || { accounts: {} }
    const removeAcct = () => {
        setUser(null)
        setAdded(false)
        Cookies.remove('jwt.callofduty')
    }
    useEffect(() => {
      if (!user) {
        setUser(getUser())
        return
      }
      if (!added && callofduty) {
        setAdded(true)
      }
      if (added && !callofduty) {
        setAdded(false)
      }
    }, [user])
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
                !callofduty?.games ? null : (
                    <>
                    <div className="profiles">
                        <h6>GAMES</h6>
                        {
                            callofduty.games.map((gameId:string) => (
                                <i key={gameId} className={`icon-callofduty-${gameInfo[gameId].icon}`} title={gameInfo[gameId].name} />
                            ))
                        }
                    </div>
                    <div className="platforms">
                        <h6>PROFILES</h6>
                        {
                            callofduty.profiles
                                .filter(({ platform }) => platform !== 'battle')
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
              added ? (
                <div className="action remove" onClick={removeAcct} />
              ) : (
                <a href="/oauth/callofduty" className="action add" />
              )
            }
        </AccountBox>
    )
}
