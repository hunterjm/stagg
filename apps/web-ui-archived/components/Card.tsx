import { useState, cloneElement } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    .dashboard-card.large {
        width: 606px;
        height: 350px;
    }
    .dashboard-card.expanded {
        width: 90vw;
        height: calc(50vw + 2rem);
        max-width: 1230px;
        max-height: 630px;
    }
`

const Container = styled.div`
    position: relative;
    margin: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    width: 295px;
    height: 210px;
    border-radius: 0.25rem;
    > label, > span {
        display: block;
        padding: 0.5rem;
    }
    > label {
        text-transform: uppercase;
        text-shadow: #000 1px 1px 0;
        font-weight: 600;
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.9);
    }
`

const ExpandButtonWrapper = styled.div`
    position: absolute;
    top: 0; right: 0;
    cursor: pointer;
    padding: 0.7rem 0.5rem;
`

interface Props { label: any, large?: boolean, expanded?:boolean, expandable?: boolean, children?: any }
export default ({ label, large, expandable, expanded=false, children }:Props) => {
    const [isExp, setIsExp] = useState(expanded)
    return (
        <Wrapper>
            <Container className={['dashboard-card', large ? 'large' : '', isExp ? 'expanded' : ''].join(' ')}>
                {
                    !expandable ? null : isExp
                        ? <ExpandButtonWrapper onClick={() => setIsExp(!isExp)}><i className="icon-zoom-out" /></ExpandButtonWrapper>
                        : <ExpandButtonWrapper onClick={() => setIsExp(!isExp)}><i className="icon-zoom-in" /></ExpandButtonWrapper>
                }
                <label>{label}</label>
                <hr />
                <span>{ cloneElement(children, { expanded: isExp }) }</span>
            </Container>
        </Wrapper>
    )
}