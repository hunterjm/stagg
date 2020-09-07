import { TextField, Button } from '@material-ui/core';
import { Layout } from 'src/components/layout';
import { Center } from 'src/components/sections/partials/Center';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 80vh;
  text-align: center;
  margin-bottom: -30rem;
  .centered-container {
    flex-direction: column !important;
    flex-wrap: no-wrap !important;
    margin: auto !important;
  }
`;

const FormWrapper = styled.div`
  border-radius: 0.5rem;
  box-shadow: 0px 0px 30px -15px #999999 inset;
  background-image: url('/assets/img/cod.banner.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-color: rgba(0, 0, 0, 0.5);
  min-width: 560px;
  width: 60vw;
  max-width: 1440px;
  min-height: 500px;
  height: 20vw;
  img {
    display: block;
    margin: auto;
    width: 24rem;
    margin-bottom: 1rem;
  }
  font-family: 'Open Sans Condensed', Verdana, Arial, Helvetica, sans-serif;
  h2 {
    margin: 0;
    padding: 0;
    font-size: 22px;
    font-spacing: normal;
    font-weight: bold;
    font-style: normal;
    text-transform: uppercase;
    text-rendering: optimizeLegibility;
  }
  h2:first-of-type {
    margin-top: 32px;
  }
  h2:last-of-type {
    margin-top: -16px;
    margin-bottom: 16px;
  }
`;

const InputWrapper = styled.div`
  * {
    color: white !important;
    border-color: white !important;
    width: 100%;
    text-align: left;
  }
  button {
    background-color: #0d121a;
    background-image: url('/assets/img/dots.png');
    border: 1px solid #81898c;
    box-shadow: 0px 0px 30px -15px #999999 inset;
    transition: all 0.4s ease-in-out;
  }
  position: relative;
  margin: 0 auto;
  width: 24rem;
  text-align: center;

  .response {
    text-align: center;
    color: red !important;
    height: 0;
    line-height: 0;
    padding: 0;
    margin: 0;
    position: relative;
    bottom: -1.5rem;
  }

  .response a {
    color: red !important;
  }
  .response.success,
  .response.success * {
    color: green !important;
  }
`;

const Spacer = styled.div`
  height: 0.5rem;
`;
const CallOfDutyLogin = () => {
  return (
    <Layout title="Best-in-class stats, coaching, matchmaking, and more | Stagg.co">
      <Wrapper className="reveal-from-right">
        <Center>
          <FormWrapper>
            <h2>JOIN THE WORLD OF</h2>
            <img src="/assets/img/cod.png" alt="Call of Duty" />
            <h2>SIGN IN TO YOUR CALL OF DUTY ACCOUNT</h2>
            <InputWrapper>
              <TextField
                autoComplete="false"
                label="Email"
                variant="outlined"
                onChange={(e) => e.target.value}
              />
              <Spacer />
              <TextField
                autoComplete="false"
                label="Password"
                type="password"
                variant="outlined"
                onChange={(e) => e.target.value}
              />
              <Spacer />
              <Button
                disabled={false}
                onClick={() => {}}
                variant="contained"
                color="primary"
              >
                {false ? 'Loading...' : 'Sign In'}
              </Button>
              <p className={['response', false ? 'success' : ''].join(' ')}>
                {}
              </p>
            </InputWrapper>
          </FormWrapper>
          <p>
            <a
              href="https://profile.callofduty.com/cod/forgotPassword"
              target="_blank"
            >
              Trouble signing in?
            </a>
          </p>
        </Center>
      </Wrapper>
    </Layout>
  );
};

export default CallOfDutyLogin;
