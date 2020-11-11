import { Layout } from 'src/components/layout'
import styled from 'styled-components'
import { Button, ButtonGroup } from '@material-ui/core'
import { ModeCard } from 'src/components/mw/components/ModeCard'
import { API } from 'src/api-services'
import humanTime from 'human-time'

const ProfileHeader = styled.div`
    > :last-child {
        display: inline-block;
        width: 50%;
    }
    > :first-child {
        display: inline-block;
        width: 50%;
        img {
            width: 64px;
        }
        .rank, .player {
            display: inline-block;
        }
        .player {
            position: relative;
            bottom: -18px;
            h2 {
                padding: 0;
                margin: 0;
                line-height: 1em;
                small {
                    font-size: 0.6em;
                    position: relative;
                    top: -0.2em;
                    color: rgba(255, 255, 255, 0.6);
                }
            }
        }
        .rank {
            position: relative;
            bottom: -32px;
            margin-right: 24px;
            text-align: center;
        }
        .rank > * {
            display: block;
            margin: 0;
            padding: 0;
            color: rgba(255, 255, 255, 0.6);
        }
        .rank > h5 {
            border: 1px solid rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.075);
            font-size: 14px;
            position: relative;
            bottom: 2px;
            line-height: 1em;
            display: inline-block;
            text-align: center;
            padding: 2px 6px;
        }
    }

    button {
        width: 120px;
    }
    i+i {
        position: relative;
        font-size: 1.025em;
        bottom: -1px;
        margin-left: 3px;
    }
    @media screen and (max-width: 768px) {
        > :last-child,
        > :first-child {
            display: block;
            width: 100%;
        }
    }
`

const LeftWrapper = styled.div`
    text-align: left;
`
const RightWrapper = styled.div`
    text-align: right;
`

const Profile = ({ games, profiles, matchHistory }) => {
  if (!profiles || !games) {
    return (
        <Layout title={`User Not Found - Call of Duty Modern Warfare Profile`} hideSignIn>
            <h2 style={{textAlign: 'center', marginTop: 128}}>Profile not found</h2>
        </Layout>
    )
  }
  const [uno] = profiles.filter(({ platform }) => platform === 'uno')
  const [username, slug] = uno.username.split('#')
  const [latestMpMatch] = matchHistory.mp.sort((a,b) => b.endTime - a.endTime)
  const [latestWzMatch] = matchHistory.wz.sort((a,b) => b.endTime - a.endTime)
  const latestEndTime = Math.max(latestMpMatch.endTime, latestWzMatch.endTime)
  const { seasonRank } = latestMpMatch
  return (
    <Layout title={`${username} Call of Duty Modern Warfare Profile`} hideSignIn>
      <div className="illustration-section-01" />
      <div className="container" style={{textAlign: 'center'}}>
        <ProfileHeader>
            <LeftWrapper>
                <div className="rank">
                    <img src="https://www.callofduty.com/cdn/app/icons/mw/ranks/mp/icon_rank_151.png" alt="Rank 151" />
                    <h5>{seasonRank}</h5>
                </div>
                <div className="player">
                    <h2>{username}<small>#{slug}</small></h2>
                    <p>Last played {humanTime(new Date(latestEndTime * 1000))}</p>
                </div>
            </LeftWrapper>
            <RightWrapper>
                <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">
                    {
                        games.includes('mw') && (
                            <Button variant="contained" title="Modern Warfare (2019)"><i className="icon-callofduty-mw" /></Button>
                        )
                    }
                    {
                        games.includes('bo4') && (
                            <Button title="Black Ops 4"><i className="icon-callofduty-bo" /><i className="icon-callofduty-bo4" /></Button>
                        )
                    }
                    {
                        games.includes('wwii') && (
                            <Button title="World War II"><i className="icon-callofduty-wwii" /></Button>
                        )
                    }
                </ButtonGroup>
            </RightWrapper>
        </ProfileHeader>
        <div style={{paddingTop: 32}}>
            <ModeCard gameId="mw" gameType="mp" matchHistory={matchHistory.mp} />
            <ModeCard gameId="mw" gameType="wz" matchHistory={matchHistory.wz} />
        </div>
      </div>
    </Layout>
  )
}

Profile.getInitialProps = async (ctx) => {
    const [gameId, playerIdentifier] = ctx.asPath.replace(/^\//, '').replace(/\/$/, '').split('/')
    const userIdParam = playerIdentifier.replace('@', '')
    const acctDetails = await API.CallOfDuty.profilesByUserId(userIdParam)
    const matchHistoryMP = await API.CallOfDuty.matchHistoryByUserId(userIdParam, gameId, 'mp')
    const matchHistoryWZ = await API.CallOfDuty.matchHistoryByUserId(userIdParam, gameId, 'wz')
    // { profiles, accountId, games, unoId, userId } = acctDetails
    return {
        games: acctDetails?.games,
        profiles: acctDetails?.profiles,
        matchHistory: {
            mp: matchHistoryMP?.sort((a,b) => b.startTime - a.startTime),
            wz: matchHistoryWZ?.sort((a,b) => b.startTime - a.startTime),
        }
    }
  }

// eslint-disable-next-line import/no-default-export
export default Profile
