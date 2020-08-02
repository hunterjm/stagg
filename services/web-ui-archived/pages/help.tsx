import Head from 'next/head'
// import Link from 'next/link'
import Center from '../components/Center'
import Template from '../components/Template'
import { Wrapper, FormWrapper } from './login'
import cfg from '../config/ui'

export const Page = ({ user, success }) => {
  const mainMsg = success
    ? 'Your Discord profile has been linked to your account.'
    : 'There was a problem trying to confirm your account...'
  const smallMsg = success
    ? 'You may now close this window'
    : 'If this persists feel free to contact support at https://stagg.co/help'
  return (
    <Template user={user}>
      <Head>
        <title>Email Confirmation</title>
      </Head>
      <Wrapper>
        <Center>
          <FormWrapper>
              <Center>
                  <h2>Your Discord profile has been linked to your account.</h2>
              </Center>
          </FormWrapper>
          {/* <p><Link href="/login"><a>Back to login</a></Link></p> */}
          <p><small>You may now close this window</small></p>
        </Center>
      </Wrapper>
    </Template>
  )
}

Page.getInitialProps = async (ctx) => {
  const jwt = ctx.query.t
  const confirmationRes = await fetch(`${cfg.api.host}/mail/confirm?jwt=${jwt}`)
  const { success } = await confirmationRes.json()
  return { success }
}

export default Page
