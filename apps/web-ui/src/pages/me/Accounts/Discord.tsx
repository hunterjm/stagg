import Cookies from 'js-cookie'
import { observer } from 'mobx-react-lite'
import { useState, useEffect, useContext } from 'react'
import { AccountBox } from './AccountBox'
import { Context } from 'src/store'
import cfg from 'config/ui'

const DiscordAccountComponent = () => {
  const store = useContext(Context)
  const [added, setAdded] = useState(false)
  const { id, avatar, tag } = store.userState?.oauth?.discord || {}
  const removeAcct = () => {
    setAdded(false)
    store.refreshUserState()
    Cookies.remove('jwt.discord')
  }
  useEffect(() => {
    setAdded(Boolean(store.userState?.oauth?.discord?.id))
  }, [store])
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
                <img className="icon" src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`} /> {tag}
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
export const DiscordAccount = observer(DiscordAccountComponent)
