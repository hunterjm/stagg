import * as store from 'src/store'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { cookies } from 'src/store'
import { getUser } from 'src/hooks/getUser'
import { useOnClickOutside } from 'src/hooks/clickOutside'
import { useRef, useState } from 'react'

const Wrapper = styled.div`
    z-index: 1;
    position: relative;
    bottom: -3px;
    img {
        width: 40px;
        border-radius: 50%;
        cursor: pointer;
    }

    .menu {
      display: none;

      positon: absolute;
      cursor: pointer;
      margin: 0;
      padding: 8px;

      font-size: 12px;
      line-height: 12px;
      border: 1px solid #333;
      background: rgba(0, 0, 0, 0.8);
    }
    .menu.active {
      display: block;
    }
`

const UserMenuComponent = () => {
  const menuRef = useRef()
  const [menuActive, setMenuActive] = useState(false)
  const userStore = store.useState(store.userState)
  const userState = userStore.get()
  const isLoggedIn = Boolean(userState.user?.userId)
  const avatar = '/cdn/core/none.avatar.jpg'
  const logout = () => {
    cookies.deleteUserJWT()
    cookies.deleteDiscordJWT()
    cookies.deleteCallOfDutyJWT()
    userStore.set(getUser())
  }
  useOnClickOutside(menuRef, () => setMenuActive(false))
  return !isLoggedIn ? null : (
    <Wrapper ref={menuRef}>
        <ul className="list-reset header-nav-right">
            <li onClick={() => setMenuActive(!menuActive)}>
                <img src={avatar} alt="Me" />
            </li>
        </ul>
        <div className={['menu', menuActive ? 'active' : ''].join(' ')} onClick={logout}>
          Log Out
        </div>
    </Wrapper>
  )
}

export const UserMenu = dynamic(() => Promise.resolve(UserMenuComponent), {
  ssr: false
})
