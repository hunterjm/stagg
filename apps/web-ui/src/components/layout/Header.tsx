import styled from 'styled-components';

import { Logo } from './partials/Logo';

const HeaderStyled = styled.header`
  z-index: 10;

  .header {
  }
`;

export const Header = props => {
  return (
    <HeaderStyled {...props} className="header">
      <Logo />
    </HeaderStyled>
  );
};
