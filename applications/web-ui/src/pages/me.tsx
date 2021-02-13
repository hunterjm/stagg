import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { State } from 'src/redux/store'
import { Template } from 'src/components/Template'
import { Spacer } from 'src/components/Spacer'
import { AccountCardDiscord, AccountCardCallOfDuty } from 'src/components/AccountCard'

const Page:NextPage<State> = () => {
  const dispatch = useDispatch()
  const doLogout = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }
  try {
    const account = useSelector<State,State.RegisteredAccount>(state => state?.account)
    const router = useRouter()
    if (!account?.id) {
      router.push('/start')
    }
  } catch(e) {}
  return (
    <Template title="My Account">
        <div className="container text-center">
            <h2 className="headline">Welcome Back</h2>
            <p className="text-lg">
                You have been successfully logged in
            </p>
            <AccountCardDiscord />
            <AccountCardCallOfDuty />
            <Spacer height={64} />
            <p>
              <button onClick={doLogout}>Log Out</button>
            </p>
        </div>
    </Template>
  )
}

// eslint-disable-next-line import/no-default-export
export default Page
