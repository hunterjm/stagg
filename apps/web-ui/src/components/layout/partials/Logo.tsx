import Link from 'next/link';
import styled from 'styled-components';

const LogoStyled = styled.div`
  color: #fff;
  cursor: pointer;
  margin-right: 32px;
  z-index: 10;

  .logo {
    &__h1 {
      margin: 0;
    }

    &__icon {
      font-size: 3rem;
    }

    &__text {
      position: relative;
      top: -0.6rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.3rem;
      font-size: 1.65rem;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }
  }
`;

export const Logo = () => {
  return (
    <LogoStyled className="logo">
      <Link href="/">
        <h1 className="logo__h1">
          <i className="logo__icon icon-stagg-antlers" />
          <span className="logo__text">Stagg</span>
        </h1>
      </Link>
    </LogoStyled>
  );
};
