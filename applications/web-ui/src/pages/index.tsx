import Link from 'next/link'
import styled from 'styled-components'
import { useState } from 'react'
import { Template } from 'src/components/Template'
import { PRICING_INDIVIDUAL } from 'config/ui'
import { Spacer } from 'src/components/Spacer'
import * as Reports from 'src/components/Reports'

const DemoWrapper = styled.div`
  position: relative;
  padding: 48px 24px 36px;
  border-radius: 4px;
  border: 1px solid #5658dd;
  display: inline-block;
  background: url('https://i.imgur.com/ltrFMNl.jpg') no-repeat center center fixed;
  ::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
  }

  .helper-tip {
    position: absolute;
    bottom: 519px;
    left: 40px;
    right: 48px;
    font-size: 12px;
    padding: 4px 6px;
    text-align: left;
    background: #222;
  }

  h1 {
    position: relative;
    top: -45px;
  }
`

const CarouselArrowWrapper = styled.div`
  position: absolute;
  padding: 10px 12px 8px;
  top: calc(50% - 16px);
  background: #040415;
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;
  i {
    font-size: 32px;
  }
  :hover {
    background: #5658dd;
  }
`

const ButtonWrapper = styled.div`
  > * :first-child {
      margin-right: 8px;
  }
  > * :last-child {
    margin-left: 8px;
  }
  @media (max-width: 500px) {
    > * {
      display: block;
      margin: 0 auto 16px auto;
    }
  }
`

const FeaturesWrapper = styled.div`
  .feature {
    vertical-align: top;
    margin: 16px;
    padding: 24px 16px 16px;
    width: 200px;
    border-radius: 4px;
    border: 1px solid #5658dd;
    display: inline-block;
    background: rgba(4,4,21, 0.6); /*#040415*/
    :hover {
      background: rgba(4,4,21, 1);
    }
    i {
      color: #fff;
      font-size: 64px !important;
    }
    p {
      text-align: justified;
    }
  }
`

const AllTimeBarracks = () => <><h1>All-Time Warzone Barracks</h1><Reports.Barracks.WZ.LazyLoader accountIdentifier={{ uno: 'MellowD#6992980' }} /></>
const WeeklyBarracks = () => <><h1>Weekly Warzone Barracks</h1><Reports.Barracks.WZ.LazyLoader accountIdentifier={{ uno: 'MellowD#6992980' }} limit={'7d'} /></>
const MonthlyBarracks = () => <><h1>Monthly Warzone Barracks</h1><Reports.Barracks.WZ.LazyLoader accountIdentifier={{ uno: 'MellowD#6992980' }} limit={'30d'} /></>
const LastMonthBarracks = () => <><h1>Last Month Warzone Barracks</h1><Reports.Barracks.WZ.LazyLoader accountIdentifier={{ uno: 'MellowD#6992980' }} limit={'30d'} skip={'30d'} /></>

const FeatureCarousel = ({ index=0 }:{ index:number }) => {
  const ComponentArray = [<AllTimeBarracks />, <WeeklyBarracks />, <MonthlyBarracks />, <LastMonthBarracks />]
  // need to catch < 0
  const safeIndex = index < 0 ? (ComponentArray.length + ((index % ComponentArray.length) || ComponentArray.length * -1))
    : index < ComponentArray.length ? index : index % (ComponentArray.length)
  return ComponentArray[safeIndex]
}

const Page = () => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0)
  return (
    <Template title="Welcome">
      <div className="container text-center">
          <h2 className="headline">Call of Duty <span className="text-primary">Companion</span></h2>
          <p className="text-lg">
              Full support for Black Ops: Cold War, Modern Warfare, and Warzone
          </p>
          <ButtonWrapper>
            <Link href="/start"><a><button className="primary">Get Started</button></a></Link>
            <a target="_blank" href="/discord/join"><button className="secondary">Join our Discord</button></a>
          </ButtonWrapper>
          <Spacer height={64} />
          <FeaturesWrapper>
          <div className="feature">
            <i className="icon-users" />
            <h3>Friend Automation</h3>
            <p>
              <small>
                Automatically add/remove players as friends when they join/leave your voice channel.
              </small>
            </p>
          </div>
          <div className="feature">
            <i className="icon-stopwatch" />
            <h3>Real-Time Data</h3>
            <p>
              <small>
                The only place to get your full match history synchronized in real-time with no delays.
              </small>
            </p>
          </div>
          <div className="feature">
            <i className="icon-heart-broken" />
            <h3>Auto-Block Cheaters</h3>
            <p>
              <small>
                We automatically block aim-bot, stim-glitch, and other cheaters from your lobbies.
              </small>
            </p>
          </div>
          <div className="feature">
            <i className="icon-trophy" />
            <h3>Cash Tournaments</h3>
            <p>
              <small>
                Everyone can get paid to play with payouts over 90% and entry fees starting at $1.
              </small>
            </p>
          </div>
          </FeaturesWrapper>
          <div className="hide-sm">
            <Spacer height={64} />
            <h2>Tired of boring stat trackers? <span className="text-primary">We know.</span></h2>
            <p>
              <small>
                Don't settle for basic Discord bots and TRN links; if you want a richer, 
                more automated experience you're not alone.
              </small>
            </p>
            <Spacer height={32} />
            {/* <h3>Generate these reports with the <span className="text-primary">Discord command below</span></h3> */}
            <DemoWrapper>
              <CarouselArrowWrapper onClick={() => setCarouselIndex(carouselIndex-1)} style={{left: -36}}><i className="icon-arrow-left" /></CarouselArrowWrapper>
              <CarouselArrowWrapper onClick={() => setCarouselIndex(carouselIndex+1)} style={{right: -36}}><i className="icon-arrow-right" /></CarouselArrowWrapper>
              <div className="helper-tip">Paste the command <a href="/discord/join">into Discord</a> and try it out</div>
              <FeatureCarousel index={carouselIndex} />
            </DemoWrapper>
          </div>
          <Spacer height={64} />
          <p className="text-lg">
            Try 30 days of premium for free, no payment information required
          </p>
          <p>
            <small>
              All features are 100% free to use in  <a href="/discord/join">our Discord server</a> 
              &nbsp;with unlimited access in any server for ${PRICING_INDIVIDUAL}/mo
            </small>
          </p>
      </div>
    </Template>
  )
}

// eslint-disable-next-line import/no-default-export
export default Page
