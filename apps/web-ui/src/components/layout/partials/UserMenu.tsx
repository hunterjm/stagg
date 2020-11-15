import * as store from 'src/store'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

const Wrapper = styled.div`
    position: relative;
    bottom: -3px;
    img {
        width: 40px;
        border-radius: 50%;
        cursor: pointer;
    }
`

const UserMenuComponent = () => {
  const userState = store.useState(store.userState).get()
  const isLoggedIn = Boolean(userState.user?.userId)
  const avatar = 'https://cdn.discordapp.com/avatars/318726630971408384/c82d7680b5139923aa14168f5f837b8f.png' || '/cdn/core/none.avatar.png'
  return !isLoggedIn ? null : (
    <Wrapper>
        <ul className="list-reset header-nav-right">
            <li>
                <img src={avatar} alt="Me" />
            </li>
        </ul>
    </Wrapper>
  )
}

export const UserMenu = dynamic(() => Promise.resolve(UserMenuComponent), {
  ssr: false
})
