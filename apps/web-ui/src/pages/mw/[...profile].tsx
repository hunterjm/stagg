import { useRouter } from 'next/router'
import { Layout } from 'src/components/layout'
import styled from 'styled-components'
import { Button, ButtonGroup } from '@material-ui/core'
import { ModeCard } from 'src/components/mw/components/ModeCard'
import { translateProfileUrlToAPI, translateProfileUrlToGameId } from 'src/components/mw/hooks'
import { API } from 'src/api-services'
import humanTime from 'human-time'
import { useState, useEffect } from 'react'
import cfg from 'config/ui'

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
        margin-left: 3px;
    }
    i+i.icon-callofduty-bo4 {
        bottom: -1px;
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

const loadMatchHistory = async (url:string) => {
  const gameId = translateProfileUrlToGameId(url)
  const identifierUrl = translateProfileUrlToAPI(url)
  const matchHistoryMP = await API.Get<any>(`/callofduty/match/history/${gameId}/mp/${identifierUrl}?limit=100`)
  const matchHistoryWZ = await API.Get<any>(`/callofduty/match/history/${gameId}/wz/${identifierUrl}?limit=100`)
  return {
    mp: matchHistoryMP?.response?.sort((a,b) => b.startTime - a.startTime),
    wz: matchHistoryWZ?.response?.sort((a,b) => b.startTime - a.startTime),
  }
}

const Profile = ({ games, profiles, matchHistory:initialMatchHistory }) => {
  if (!profiles || !games) {
    return (
        <Layout title={`User Not Found - Call of Duty Modern Warfare Profile`} hideSignIn>
            <h2 style={{textAlign: 'center', marginTop: 128}}>Profile not found</h2>
        </Layout>
    )
  }
  const router = useRouter()
  const [uno] = profiles.filter(({ platform }) => platform === 'uno')
  const [username, slug] = uno.username.split('#')
  const [reloading, setReloading] = useState(null)
  const [matchHistory, setMatchHistory] = useState(initialMatchHistory)
  const [latestMpMatch] = matchHistory.mp.sort((a,b) => b.endTime - a.endTime)
  const [latestWzMatch] = matchHistory.wz.sort((a,b) => b.endTime - a.endTime)
  const latestEndTime = Math.max(latestMpMatch?.endTime, latestWzMatch?.endTime)
  const rankValue = latestMpMatch?.seasonRank || 1
  const rankValueStr = rankValue < 10 ? `0${rankValue}` : `${rankValue}`
  const refreshProfile = async () => {
    console.log('refreshing profile')
    setReloading(true)
    const newMatchHistory = await loadMatchHistory(router.asPath)
    setMatchHistory(newMatchHistory)
    setReloading(false)
    setTimeout(refreshProfile, cfg.profile.refresh)
  }
  useEffect(() => {
    setTimeout(refreshProfile, cfg.profile.refresh)
  }, [])
  return (
    <Layout title={`${username} Call of Duty Modern Warfare Profile`}>
      <div className="illustration-section-01" />
      <div className="container" style={{textAlign: 'center'}}>
        <ProfileHeader>
            <LeftWrapper>
                <div className="rank">
                    <img src={`https://www.callofduty.com/cdn/app/icons/mw/ranks/mp/icon_rank_${rankValueStr}.png`} alt={`Rank ${rankValueStr}`} />
                    <h5>{latestMpMatch?.seasonRank}</h5>
                </div>
                <div className="player">
                    <h2>{username}<small>#{slug}</small></h2>
                    <p>Last played {humanTime(new Date(latestEndTime * 1000))}</p>
                </div>
            </LeftWrapper>
            <RightWrapper>
                <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">
                    {
                        games.includes('cw') && (
                            <Button title="Black Ops: Cold War"><i className="icon-callofduty-bo" /><i className="icon-poo" /></Button>
                        )
                    }
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
    const identifierUrl = translateProfileUrlToAPI(ctx.asPath)
    console.log(identifierUrl)
    const accountModel = await API.Get<any>(`/callofduty/account/${identifierUrl}`)
    if (!accountModel?.response?.games || !accountModel?.response?.profiles) {
        return {}
    }
    const { games, profiles } = accountModel?.response
    try {
        const matchHistory = await loadMatchHistory(ctx.asPath)
        return {
            games,
            profiles,
            matchHistory
        }
    } catch(e) {
        console.log(e)
        return { games, profiles }
    }
  }

// eslint-disable-next-line import/no-default-export
export default Profile
