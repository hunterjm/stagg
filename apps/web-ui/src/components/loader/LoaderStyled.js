import styled from 'styled-components';

export const LoaderStyled = styled.div`
  background-color: black;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  .loader {
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      animation: pulse 2s infinite ease-in-out;
    }
    &__stagg-icon {
      font-size: 150px;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0px 0px 25px 0px rgba(255,255,255,0.15);
    }
    50% {
      box-shadow: 0px 0px 25px 5px rgba(255,255,255,0.20);
    }
    100% {
      box-shadow: 0px 0px 25px 0px rgba(255,255,255,0.15);
    }
  }
`;
