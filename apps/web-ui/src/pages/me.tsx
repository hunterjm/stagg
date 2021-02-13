import Router from 'next/router'
import * as store from 'src/store'
import dynamic from 'next/dynamic'

const Dashboard = () => {
  const userState = store.useState(store.userState).get()
  const isLoggedIn = Boolean(userState.user?.userId)
  if (!isLoggedIn) {
      Router.push('/start')
  } else {
    Router.push('/profile')
  }
  return null
}

// eslint-disable-next-line import/no-default-export
export default dynamic(() => Promise.resolve(Dashboard), {
  ssr: false
})
