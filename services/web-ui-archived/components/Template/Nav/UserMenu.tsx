import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { useOnClickOutside } from '../../../hooks'

const Wrapper = styled.span`
    margin-left: 1.25rem;
    img {
        width: 2.5rem;
        height: 2.5rem;
        position: relative;
        top: -0.52rem;
        left: -0.52rem;
        right: 3px;
        border-radius: 50%;
    }
    aside {
        z-index: 4;
        label {
            display: block;
            margin-right: 1.5rem;
            img, i {
                position: relative;
                top: 2px;
                left: -2px;
                width: 1rem;
                height: 1rem;
            }
        }
    }
    .menu-button {
        position: relative;
        top: 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.5);
    }
`

export default ({ user }) => {
    const ref = useRef()
    const [open, setOpen] = useState(false)
    useOnClickOutside(ref, () => setOpen(false))
    const signOut = () => {
        Cookies.set('jwt', '', { expires: -1 })
        window.location.reload()
    }
    const lvl = `https://i.imgur.com/1qddTUx.png`
    const iconImgUrl = user?.discord?.avatar
        ? `https://cdn.discordapp.com/avatars/${user?.discord?.id}/${user?.discord?.avatar}.webp`
        : lvl
    return (
        <Wrapper ref={ref} className={[open ? 'open' : '', 'menu-wrapper'].join(' ')}>
            {
                !open ? null : (
                    <aside>
                        {
                            !user?.discord?.username ? null
                                : <label><i className="icon-discord" />{ `${user.discord.username}#${user.discord.discriminator}` }</label>
                        }
                        {
                            !user?.profiles?.uno ? null : (
                                <Link href="/wz/[id]" as={`/wz/${user.profiles.uno?.split('#')?.join('@')}`}>
                                    <a><label style={{cursor: 'pointer'}}><img src={lvl} alt="Activision" />{ user.profiles.uno }</label></a>
                                </Link>
                            )
                        }
                        <Button onClick={signOut} size="small" variant="contained" color="primary"
                            style={{margin: '24px 0 0', fontSize: '12px', padding: '3px 12px 1px', width: '100%'}}>Sign out</Button>
                    </aside>
                )
            }
            <div className={[open ? 'open' : '', 'menu-button'].join(' ')} onClick={() => setOpen(!open)}>
                <img src={iconImgUrl} alt={user.profiles?.uno} />
            </div>
        </Wrapper>
    )
}