import { useState, useRef } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../hooks'

const Wrapper = styled.span`
    display: inline-block;
    position: relative;
    z-index: 1;
    ul {
        text-align: left;
        position: absolute;
        cursor: pointer;
        display: inline-block;
        list-style: none;
        margin: 0;
        padding: 0;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 0, 0, 0.5);
        li {
            display: none;
            padding: 0.2rem 0.5rem 0.25rem;
            background: rgba(0, 0, 0, 0.75);
        }
        li:first-of-type {
            display: block;
            background: none;
        }
    }

    ul.open {
        li {
            display: block;
            :hover {
                background: rgba(0, 0, 0, 1);
            }
        }
    }

    span {
        display: inline-block;
    }
`

interface Item { label: any, onClick: any }
interface Props { activeItem: Item, items: Item[], width: string }
export default ({ activeItem, items, width }:Props) => {
    const ref = useRef()
    const [open, setOpen] = useState(false)
    useOnClickOutside(ref, () => setOpen(false))
    return (
        <Wrapper>
            <ul ref={ref} style={{ width }} onClick={() => setOpen(!open)} className={open ? 'open' : ''}>
                <li key="-1" onClick={activeItem.onClick}>{activeItem.label}</li>
                {
                    items.map((item,i) => (
                        item.label === activeItem.label ? null : <li key={i} onClick={item.onClick}>{item.label}</li>
                    ))
                }
            </ul>
            <span style={{ width }}></span>
        </Wrapper>
    )
}