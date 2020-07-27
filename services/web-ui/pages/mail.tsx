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
    : 'Feel free to reach out at https://stagg.co/help if this persists'
  return (
    <Template user={user}>
      <Head>
        <title>Email Confirmation</title>
      </Head>
      <Wrapper>
        <Center>
          <FormWrapper>
              <Center>
                  <h2>{ mainMsg }</h2>
              </Center>
          </FormWrapper>
          {/* <p><Link href="/login"><a>Back to login</a></Link></p> */}
          <p><small>{ smallMsg }</small></p>
        </Center>
      </Wrapper>
    </Template>
  )
}

Page.getInitialProps = async (ctx) => {
  const token = new Buffer(ctx.query.t, 'base64')
  const jwt = token.toString('ascii')
  const confirmationRes = await fetch(`${cfg.api.host}/mail/confirm?jwt=${jwt}`)
  try {
    const { success } = await confirmationRes.json()
    return { success }
  } catch(e) {
    console.log('[!] Confirmation error', e)
    return { success: false }
  }
}

export default Page
