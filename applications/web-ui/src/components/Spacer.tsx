import styled from 'styled-components'
export const Spacer = styled.div(({ height }:{ height:number|string }) => `
    height: ${height}px;
`)
