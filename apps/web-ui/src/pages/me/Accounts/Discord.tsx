import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { AccountBox } from './AccountBox'
import { getUser } from 'src/hooks/getUser'
import cfg from 'config/ui'

export const DiscordAccount = () => {
  const [user, setUser] = useState(null)
  const [added, setAdded] = useState(false)
  const { accounts: { discord } } = user || { accounts: {} }
  const removeAcct = () => {
      setUser(null)
      setAdded(false)
      Cookies.remove('jwt.discord')
  }
  useEffect(() => {
    if (!user) {
      setUser(getUser())
      return
    }
    if (!added && discord) {
      setAdded(true)
    }
    if (added && !discord) {
      setAdded(false)
    }
  }, [user])
  return (
      <AccountBox>
        <div className="branding">
          <i className="icon-discord filled" />
          <h6>Discord</h6>
        </div>
        <div className="permissions">
          <h6>PERMISSIONS</h6>
          <ul>
            <li><i className="icon-discord-check" /> Send you messages and invites</li>
            <li><i className="icon-discord-check" /> Access your username and avatar</li>
          </ul>
        </div>
        {
          !added ? null : (
            <div className="profiles">
                <h6>PROFILE</h6>
                <img className="icon" src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`} /> {discord.tag}
            </div>
          )
        }
        {
          added ? (
            <div className="action remove" onClick={removeAcct} />
          ) : (
            <a href={`${cfg.discord.url.oauth}&state=1`} className="action add" />
          )
        }
      </AccountBox>
  )
}
