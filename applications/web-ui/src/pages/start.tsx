import { Model } from '@stagg/api'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'src/redux/store'
import { Template } from 'src/components/Template'
import { AccountCardDiscord, AccountCardCallOfDuty } from 'src/components/AccountCard'
import { apiService } from 'src/api-service'

const Page:NextPage<State> = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const jwt = useSelector<State,State.JWTs>(state => state?.jwt)
  const account = useSelector<State,State.RegisteredAccount>(state => state?.account)
  const discord = useSelector<State,Model.Account.Discord>(state => state?.accountProvision?.discord)
  const callofduty = useSelector<State,Model.Account.CallOfDuty>(state => state?.accountProvision?.callofduty)
  const submitRegistration = async () => {
    const api = apiService(dispatch)
    await api.registerProvisionedAccounts(jwt?.provision)
  }
  try {
    if (account?.id) {
      router.push('/me')
    }
  } catch(e) {}
  return (
    <Template title="Getting Started" hideSignIn>
        <div className="container text-center">
            <h2 className="headline">Getting Started</h2>
            <p className="text-lg">
                Link your Discord and Call of Duty accounts, we'll take care of the rest
            </p>
        </div>
        <div className="container text-center">
            <AccountCardDiscord />
            <AccountCardCallOfDuty />
            {
              discord?.id || callofduty?.profiles?.length ? (
                <p>
                  <button className="primary" onClick={submitRegistration} disabled={Boolean(!discord?.id || !callofduty?.profiles?.length)}>
                    Complete Registration
                  </button>
                </p>
              ) : (
                <p><small>If you're an existing member, authorize either account to proceed</small></p>
              )
            }
        </div>
    </Template>
  )
}

// eslint-disable-next-line import/no-default-export
export default Page
