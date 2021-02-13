import Link from 'next/link'
import styled from 'styled-components'

const Wrapper = styled.div`
    text-align: left;
    position: relative;
    vertical-align: top;
    display: inline-block;
    width: 320px;
    margin: 8px;
    border: 1px solid #777;
    border-radius: 4px;

    .action {
        opacity: 1;
        transition: opacity 0.1s ease;
        position: absolute;
        top: 8px; right: 8px;
        border: 1px solid;
        border-radius: 4px;
        font-size: 0.75em;
        padding: 8px;
        cursor: pointer;
        text-align: center;
        width: 90px;
    }
    
    .action.add {
        border-color: #6163FF;
        color: #6163FF;
    }
    .action.add:after {
        content: "Authorize";
    }

    .action.locked,
    .action.remove {
        border-color: #22B14C;
        color: #22B14C;
    }

    .action.locked:after,
    .action.remove:after {
        content: "Looks good";
    }

    .action.locked:hover {
        cursor: default;
    }

    .action.remove:hover {
        border-color: red;
        color: red;
        content: "Remove?";
    }

    .action.remove:hover:after {
        content: "Remove?";
    }

    .action.remove {
        border-color: #22B14C;
        color: #22B14C;
    }
    
    .branding {
        padding: 12px 12px 12px;
    }

    .branding * {
        margin: 0;
        padding: 0;
        display: inline-block;
    }
    .branding h6 {
        font-size: 1.2em;
    }
    
    .branding i {
        position: relative;
        bottom: -4px;
        margin-right: 8px;
        font-size: 1.5em;
    }

    .games, .profiles, .permissions {
        padding: 4px 12px 4px;
    }

    .permissions ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .permissions ul > li {
        margin: 4px 0;
        padding: 1px;
        list-style: none;
        font-size: 0.77em;
    }
    .permissions i.icon-discord-check {
        color: #22B14C;
        font-size: 1.2em;
        position: relative;
        bottom: -2px;
        margin-right: 4px;
    }

    .games h6,
    .profiles h6,
    .permissions h6 {
        font-size: 0.7em;
        color: #777;
        margin: 0 0 4px 0;
        padding: 0;
    }

    .profiles h6 {
        margin: 0;
    }

    .games {
        margin-bottom: 16px;
    }

    .games i {
        color: #fff;
        font-size: 1.65rem;
        margin: 6px 12px 0 0;
    }

    .profiles ul,
    .profiles ul li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .profiles ul {
        padding-bottom: 6px;
    }
    .profiles ul li {
        padding: 0;
        margin: 0 0 4px 0;
    }
    .profiles ul li .name {
        padding: 0;
    }
    .profiles ul li .icon {
        position: relative;
        bottom: -4px;
        color: #fff;
        padding-right: 4px;
        font-size: 1.25em;
    }
    .profiles ul li .icon img {
        position: relative;
        bottom: -1px;
        width: 1em;
        height: 1em;
        border-radius: 50%;
    }
    
    
    i.icon-callofduty-c {
        color: #000;
    }
`
interface AccountActionProps {
    active: boolean
    locked?: boolean
    deauthorize(): void
    authorizeUrl: string
}
const AccountAction = ({ active, deauthorize, authorizeUrl, locked }:AccountActionProps) => {
    if (active) {
        return <div className={`action ${locked ? 'locked' : 'remove'}`} onClick={locked ? null : deauthorize} />
    }
    if (authorizeUrl.match(/^http/i)) {
        return <a className="action add" href={authorizeUrl}></a>
    }
    return <Link href={authorizeUrl}><a className="action add"></a></Link>
}
const ProfileIcon = ({ icon, title }:{ icon:string, title?:string }) => {
    if (icon.includes('/')) {
        return <img src={icon} title={title} />
    }
    return <i className={icon} title={title}></i>
}


export interface AccountCardDetails {
    name: string
    icon: string // URL or Icomoon className
}
export interface AccountCardGame extends AccountCardDetails {}
export interface AccountCardProfile extends AccountCardDetails {
    platform?: string
}
export interface AccountCardProps {
    locked?: boolean
    providerName: string
    providerIcon: string
    deauthorize(): void
    authorizeUrl: string
    permissions: string[]
    profiles?: AccountCardProfile[]
    games?: AccountCardGame[]
}
export const AccountCard = ({ locked, providerName, providerIcon, deauthorize, authorizeUrl, permissions, profiles, games }:AccountCardProps) => {
    return (
        <Wrapper>
            <AccountAction locked={locked} active={profiles?.length > 0} deauthorize={deauthorize} authorizeUrl={authorizeUrl} />
            <div className="branding">
                <i className={`${providerIcon} filled`}></i>
                <h6>{providerName}</h6>
            </div>
            <div className="permissions">
                <h6>PERMISSIONS</h6>
                <ul>
                    {
                        permissions.map((p:string, i:number) => (
                            <li key={i}><i className="icon-discord-check"></i> {p}</li>
                        ))
                    }
                </ul>
            </div>
            {
                !games?.length ? null : (
                    <div className="games">
                        <h6>GAMES</h6>
                        {
                            games.map((game:AccountCardGame) => (
                                <i key={game.name} className={game.icon} title={game.name}></i>
                            ))
                        }
                    </div>
                )
            }
            {
                !profiles?.length ? null : (
                    <div className="profiles">
                        <h6>PROFILE{profiles.length === 1 ? null : 'S' }</h6>
                        <ul>
                        {
                            profiles.map((profile:AccountCardProfile) => (
                                <li key={profile.name}>
                                    <span className="icon"><ProfileIcon icon={profile.icon} title={profile.platform} /></span>
                                    <span className="name">{profile.name}</span>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                )
            }
        </Wrapper>
    )
}
