import { Layout } from 'src/components/layout'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  text-align: left;
  .join-discord-button {
    position: absolute;
    top: 0; right: 0;
  }
`

const HelpPage = () => {
  return (
    <Layout title="Need some help?" simpleSignIn hideHelp>
      <div className="illustration-section-01" />
      <div className="container">
        <Wrapper>
        <h2>Need some help?</h2>
        <a className="join-discord-button" href="/discord/join">
          <button className="button button-primary button-wide-mobile button-sm">
            Join our Discord
          </button>
        </a>
        <p>
            <small>
                We do our best to keep this area updated with FAQs and other help material 
                as we learn more about what struggles users face.
                In the meantime, if you need help with anything that is not explained below 
                please <a href="/discord/join">ask for help in our Discord server</a>.
            </small>
        </p>
        <h5>How do I use Stagg?</h5>
        <p>
            You can use Stagg to check game history and stats or you can use Stagg to improve your skills and meet new players of similar skill-level.
            Both of these features are available to all users, premium and free.
        </p>
        <h5>Do I have to pay to use Stagg?</h5>
        <p>
            Nope! All features are 100% free to use on <a href="/">Stagg.co</a> and in the <a href="/discord/join">Official Stagg Discord Server</a>.
        </p>
        <h5>How do I start using Stagg?</h5>
        <p>
            Just head over to our <a href="/start">getting started page</a> and sign-in with your Call of Duty account. Once you've signed in, your
            match history will automatically be downloaded in the background and you can begin using all features immediately. Your match history will
            first populate your most recent matches; the total process takes 5-10 minutes for the average player with 1k-2k matches.
        </p>
        <h5>Does Stagg support games other than Call of Duty?</h5>
        <p>
            While we support every Call of Duty title from WWII and beyond, we currently do not support any additional games. Several additions will be
            coming in the future as we have more resources to build those out.
        </p>
        </Wrapper>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default HelpPage
