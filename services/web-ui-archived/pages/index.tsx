import Link from 'next/link'
import Head from 'next/head'
import styled from 'styled-components'
import Center from '../components/Center'
import Template from '../components/Template'
import { commaNum } from '@stagg/util'
import cfg from '../config/ui'

const GameWrapper = styled.div`
    position: relative;
    font-family: "Open Sans Condensed", Verdana, Arial, Helvetica, sans-serif;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 30px -15px #999999 inset;
    background-image: url('/assets/img/cod.banner.png');
    background-repeat:no-repeat;
    background-size: cover;
    background-position: center center;
    background-color: rgba(0, 0, 0, 0.5);
    min-width: 300px;
    min-height: 120px;
    width: 25vw;
    height: 10vw;
    img {
        min-width: 220px;
        width: 18vw;
    }
    h2 {
        margin: -10px 0 0 0;
        padding: 0;
        font-size: 26px;
        font-weight: bold;
        font-style: normal;
        text-transform: uppercase;
        text-rendering: optimizeLegibility;
    }
    p {
        position: absolute;
        bottom: -0.5rem;
        width: 100%;
        text-align: center;
    }
`
const Page = ({ meta, user }) => {
    const linkUrl = !user ? '/login' : '/wz/[id]'
    const asLinkUrl = !user ? '/login' : `/wz/${user.profiles?.uno?.split('#').join('@')}`
    return (
        <Template user={user}>
            <Head>
                <title>Call of Duty - Warzone</title>
            </Head>
            <h1 style={{textAlign: 'center'}}>Supported Games</h1>
            <Center>
                <GameWrapper>
                    <Center>
                        <Link href={linkUrl} as={asLinkUrl}>
                            <a>
                                <img src="/assets/img/cod.png" alt="Call of Duty" />
                                <h2>Modern Warfare</h2>
                            </a>
                        </Link>
                        <p>{ commaNum(meta.players) } players | { commaNum(meta.performances) } matches | { commaNum(meta.matches * 147) } enemies</p>
                    </Center>
                </GameWrapper>
            </Center>
        </Template>
    )
}

Page.getInitialProps = async (ctx) => {
    const metaRes = await fetch(`${cfg.api.host}/meta`)
    const meta = await metaRes.json()
    return { meta }
}

export default Page
