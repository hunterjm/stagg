import styled from 'styled-components'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Template } from 'src/components/Template'
import { apiService } from 'src/api-service'
import { useRouter } from 'next/router'

const Wrapper = styled.div`
    padding: 32px;
    margin: 5vh auto 32px;
    border-radius: 12px;
    background-image: url('/assets/images/callofduty/auth.banner.png');
    font-family: 'Open Sans Condensed', Verdana, Arial, Helvetica, sans-serif;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0px 0px 30px -15px #999999 inset;

    .error {
        color: red;
    }

    > img {
        max-width: 80vw;
    }

    h2 {
        font-size: 22px;
        font-weight: bold;
        font-style: normal;
        text-transform: uppercase;
        text-rendering: optimizeLegibility;
    }
    button {
        color: #fff;
        width: 100%;
        font-weight: 500;
        background-color: #0d121a;
        border: 1px solid #81898c;
        box-shadow: 0px 0px 30px -15px #999999 inset;
        background-image: url('/assets/images/callofduty/auth.button.dots.png');
    }
    button:hover {
        border-color: #fff;
    }
    .form-container {
        margin: auto;
        width: 100%;
        max-width: 460px;
    }
    .floating-label {
        margin-bottom: 20px;
    }
    .floating-label input {
        border: 1px solid #81898c;
        border-radius: 4px;
        padding-left: 12px;
        width: calc(100% - 18px);
        height: 42px;
        background: rgba(255, 255, 255, 0.1);
    }
    .floating-label label {
        top: 16px;
        left: 12px;
    }
    .floating-label input:focus ~ label,
    .floating-label input:not(:placeholder-shown) ~ label {
        left: 1px;
    }

    .floating-label select:focus ~ label,
    .floating-label select:not([value=""]):valid ~ label {
        left: 1px;
    }
`

const Page = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginErr, setLoginErr] = useState('')
    const [buttonEnabled, setButtonEnabled] = useState(true)
    const doLogin = async () => {
        setLoginErr('')
        setButtonEnabled(false)
        const api = apiService(dispatch, setLoginErr)
        const success = await api.callofdutyAuthorizationExchange(email, password)
        if (success) {
            router.push('/start')
        } else {
            setButtonEnabled(true)
        }
    }
    return (
        <Template title="Sign In - Call of Duty" hideSignIn>
            <Wrapper className="container text-center">
                <h2>JOIN THE WORLD OF</h2>
                <img src="/assets/images/callofduty/auth.branding.png" alt="Call of Duty" />
                <h2>SIGN IN TO YOUR CALL OF DUTY ACCOUNT</h2>
                <div className="form-container">
                    <div className="floating-label">
                        <input type="text" placeholder=" " onChange={e => setEmail(e.target.value)} />
                        <span className="highlight"></span>
                        <label>Email</label>
                    </div>
                    <div className="floating-label">
                        <input type="password" placeholder=" " onChange={e => setPassword(e.target.value)} />
                        <span className="highlight"></span>
                        <label>Password</label>
                    </div>
                    <button disabled={!buttonEnabled} onClick={doLogin}>{!buttonEnabled ? 'LOADING...' : 'SIGN IN'}</button>
                    <p className="error">{loginErr}</p>
                </div>
            </Wrapper>
            <div className="container text-center">
                <p>
                    <a target="_blank" href="https://profile.callofduty.com/cod/forgotPassword">Trouble signing in?</a>
                </p>
            </div>
        </Template>
    )
}

// eslint-disable-next-line import/no-default-export
export default Page
