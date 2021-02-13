import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { State } from 'src/redux/store'

export interface InterfaceTemplateProps {
    title: string
    children: ReactNode
    hideSignIn?: boolean
    renderReport?: boolean
}
export const InterfaceTemplate = ({ title, children, hideSignIn }:InterfaceTemplateProps) => {
    const account = useSelector<State,State.RegisteredAccount>(state => state?.account)
    if (account?.id) {
        hideSignIn = true
    }
    return (
      <>
        <Head>
          <title>{ title } - Stagg.co</title>
        </Head>
        <header>
            <div className="container">
                <h1 className="brand">
                    <Link href="/">
                        <a>
                            <i className="icon-stagg-antlers"></i>
                            Stagg
                        </a>
                    </Link>
                </h1>
                <nav>
                    <ul>
                        <li><a href="/discord/help" target="_blank">Need help?</a></li>
                        {
                            hideSignIn ? null : (
                                <li><Link href="/start"><a><button className="sm primary">Sign in</button></a></Link></li>
                            )
                        }
                        {
                            !account?.id ? null : (
                                <li className="avatar">
                                    <Link href="/me">
                                        <img src={
                                            account.discord.avatar 
                                            ? `https://cdn.discordapp.com/avatars/${account.discord.id}/${account.discord.avatar}.png` 
                                            : '/assets/images/none.avatar.jpg'} alt={account.discord.tag
                                            } />
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                </nav>
            </div>
        </header>
        <main>
            { children }
        </main>
        <footer><Link href="/terms"><a>&copy; 2021</a></Link></footer>
      </>
    )
}