import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    max-width: 1280px;
`

export default ({ children }) => {
    return (
        <Container className="centered-container">
            { children }
        </Container>
    )
}