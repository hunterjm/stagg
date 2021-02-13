import { useRouter } from 'next/router'
import { NextPage, NextPageContext } from 'next'
import { State } from 'src/redux/store'
import { apiService } from 'src/api-service'

const Page:NextPage<State> = () => {
    try {
        const router = useRouter()
        router.push('/start')
    } catch(e) {}
    return null
}

Page.getInitialProps = async ({ store, res, query }:NextPageContext) => {
    const oauthCode = query.code as string
    const api = apiService(store.dispatch)
    await api.discordOAuthExchange(oauthCode)
    return {}
}

// eslint-disable-next-line import/no-default-export
export default Page
