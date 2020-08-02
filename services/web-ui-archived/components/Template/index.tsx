import Head from 'next/head'
import styled from 'styled-components'
import Main from './Main'
import Nav from './Nav'
import Footer from './Footer'
import ForceHTTPS from '../ForceHTTPS'

const Container = styled.div`
    background: url(/assets/img/bg.jpg) no-repeat center center fixed; 
    background-color: #0d121a;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 100%;

    hr {
        border-width: 1px;
        border-color: rgba(255, 255, 255, 0.07);
        display: block;
        margin: 0 auto;
        padding: 0 !important;
    }
`

export const Overlay = styled.div`
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
`
export const FixedOverlay = styled.div`
    position: fixed;
    z-index: 9;
    top: 0; right: 0; left: 0; bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
`

export default ({ children, user }) => {
    return (
        <Container>
            <Head>
                <link rel="stylesheet" href="/assets/css/base.css" media="all" />
                <link rel="stylesheet" href="/assets/css/icomoon.css" media="all" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700%7COpen+Sans:300,400,700&amp;subset=latin,latin,latin" media="all" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-171798332-1"></script>
                <script src="/assets/js/ga.js"></script>
            </Head>
            <Overlay>
                <Nav user={user} />
                <Main>
                    { children }
                </Main>
                <Footer />
            </Overlay>
            <ForceHTTPS />
        </Container>
    )
}
