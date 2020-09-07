import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    span {
        color: gray;
        border: 1px solid gray;
        border-radius: 50%;
    }

    div {
        display: none;
    }

    div.open {
        display: block;
    }

`

export default ({ icon, text, open=false }) => {
    const [isOpen, setIsOpen] = useState(open)
    return (
        <Container className="tooltip">
            <span>{ icon }</span>
            <div className={isOpen ? 'open' : ''}>{ text }</div>
        </Container>
    )
}