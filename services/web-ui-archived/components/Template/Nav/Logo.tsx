import Link from 'next/link'
import styled from 'styled-components'

const Wrapper = styled.span`
    position: absolute;
    top: -1.75rem; left: 0;
    font-size: 4rem;
    i, span {
        display: inline-block;
        float: none;
    }
    span {
        position: relative;
        top: -0.85rem;
        font-size: 2rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -0.3rem;
    }
`
export default (props:any) => {
    return (
        <Wrapper>
            <Link href="/">
                <a>
                    <i className="icon-stagg-antlers" />
                    <span>Stagg</span>
                </a>
            </Link>
        </Wrapper>
    )
}