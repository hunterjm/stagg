import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../../hooks'
import cfg from '../../../config/ui'

const Wrapper = styled.span`
    aside {
        z-index: 2;
        padding: 0.1rem 0.5rem !important;
        min-height: 3rem !important;
        input {
            margin: 0;
            padding-top: 0.5rem;
            width: 100%;
            font-size: 1.2rem;
            background: none;
            border: none;
            outline: none;
            color: #ccc;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        }
    
        ul {
            width: 100%;
            margin: 0 auto;
            padding: 0;
            list-style: none;
    
            li {
                text-align: left;
                cursor: pointer;
                padding: 0.5rem 0.25rem;
            }
            li:hover {
                background: rgba(0, 0, 0, 0.5)
            }
        }
    }
`

export default ({}) => {
    const ref = useRef()
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [results, setResults] = useState([])
    useOnClickOutside(ref, () => setOpen(false))
    const updateSearch = async (input:string) => {
        setInput(input)
        if (input.length > 1) {
            const search = await fetch(`${cfg.api.host}/search`, {
                method: 'POST',
                body: JSON.stringify({ username: input, platform: 'uno' })
            })
            const players = await search.json()
            setResults(players.filter(p => p.profiles).map(p => p.profiles.uno))
        }
    }
    const clickProfile = (username) => {

    }
    return (
        <Wrapper ref={ref} className={[open ? 'open' : '', 'menu-wrapper'].join(' ')}>
            {
                !open ? null : (
                    <aside>
                        <input placeholder="Search players to compare..." type="text" value={input} onChange={e => updateSearch(e.target.value)} />
                        <ul>
                            { !input.length ? null : results.map(r => <li key={r} onClick={() => clickProfile(r)}>{r}</li>) }
                        </ul>
                    </aside>
                )
            }
            <div className="menu-button" onClick={() => setOpen(!open)}>
                <i className="icon-search" />
            </div>
        </Wrapper>
    )
}