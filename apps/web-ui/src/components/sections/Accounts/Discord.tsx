import Cookies from 'js-cookie'
import { AccountBox } from './AccountBox'
import * as store from 'src/store'
import cfg from 'config/ui'

export const DiscordAccount = () => {
  const storeUserState = store.useState(store.userState)
  const userState = storeUserState.get()
  const { id, avatar, tag } = userState?.oauth?.discord || {}
  const removeAcct = () => {
    storeUserState.set(state => ({
        ...state,
        oauth: {
            ...state.oauth,
            discord: null
        }
    }))
    store.cookies.deleteDiscordJWT()
  }
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
          !Boolean(id) ? null : (
            <div className="profiles">
                <h6>PROFILE</h6>
                <img className="icon" src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`} /> {tag}
            </div>
          )
        }
        {
          Boolean(id) ? (
            <div className="action remove" onClick={removeAcct} />
          ) : (
            <a href={`${cfg.discord.url.oauth}&state=`} className="action add" />
          )
        }
      </AccountBox>
  )
}
