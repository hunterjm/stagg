import * as store from 'src/store'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styled from 'styled-components'

const Wrapper = styled.div`

`

const LoginMenuComponent = ({ simpleSignIn, closeMenu }) => {
  const userState = store.useState(store.userState).get()
  const isLoggedIn = Boolean(userState.user?.userId)
  return isLoggedIn ? null : (
    <Wrapper>
        <ul className="list-reset header-nav-right">
        <li>
            <Link href="/start">
            <a
                onClick={closeMenu}
                className={simpleSignIn ? 'text-xs' : 'button button-primary button-wide-mobile button-sm'}
            >
                Sign In
            </a>
            </Link>
        </li>
        </ul>
    </Wrapper>
  )
}

export const LoginMenu = dynamic(() => Promise.resolve(LoginMenuComponent), {
  ssr: false
})
