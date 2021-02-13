import ordinal from 'ordinal'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { request } from 'src/api-service'
import {
    commaNum,
    commaToFixed,
    CommandWrapper,
    BarracksWrapper,
    ReportLazyLoadProps,
    ReportAccountProps,
} from '..'

export interface Props extends ReportAccountProps {
    rank: {
        id: number
        label: string
    }
    stats: {
        wins: number
        score: number
        games: number
        kills: number
        deaths: number
        revives: number
        avgFinish: number
        timePlayed: number
        damageDone: number
        damageTaken: number
        top10FinishRate: number
        gulagWinRate: number
        finalCircles: number
        bestKillstreak: number
        timeMovingPercentage: number
    }
}

export const Component = (props:ReportLazyLoadProps|Props) => {
    const propsAsComplete = props as Props
    const propsAsIncomplete = props as ReportLazyLoadProps
    if (!propsAsComplete.stats) {
        if (!propsAsIncomplete.accountIdentifier) {
            throw 'Cannot lazy-load report component without accountIdentifier'
        }
        return <LazyLoader accountIdentifier={propsAsIncomplete.accountIdentifier} />
    }
    return <View {...propsAsComplete} />
}

const LoadingWrapper = styled.div`
    width: 680px;
    height: 480px;
`
export const LazyLoader = ({ accountIdentifier, limit=0, skip=0 }:ReportLazyLoadProps&{ limit?:number, skip?:number }) => {
    const [reportProps, setReportProps] = useState<Props>(null)
    const loader = async () => {
        console.log('loading with limit', limit)
        const props = await PropsLoader({ accountIdentifier }, limit, skip)
        setReportProps(props)
    }
    useEffect(() => { !reportProps ? loader() : null })
    if (!reportProps) {
        return (
            <LoadingWrapper>Loading...</LoadingWrapper>
        )
    }
    return (
        <View {...reportProps} />
    )
}

export const PropsLoader = async ({ accountIdentifier }:ReportLazyLoadProps, limit:number=0, skip:number=0) => {
    if (!accountIdentifier.uno) {
        throw 'uno username required'
    }
    const { data } = await request<any>(`/callofduty/${encodeURIComponent(accountIdentifier.uno)}/wz/barracks?limit=${limit}&skip=${skip}`)
    if (!data.account) {
        return null
    }
    return {
        _propsLoader: { limit, skip },
        account: data.account.callofduty,
        rank: {
            id: data.stats.rankId,
            label: data.stats.rankLabel,
        },
        stats: {
            wins: data.stats.wins,
            score: data.stats.score,
            games: data.stats.games,
            kills: data.stats.kills,
            deaths: data.stats.deaths,
            revives: data.stats.revives,
            avgFinish: Math.round(data.stats.teamPlacement / data.stats.games) || 0,
            timePlayed: data.stats.timePlayed,
            damageDone: data.stats.damageDone,
            damageTaken: data.stats.damageTaken,
            finalCircles: data.stats.finalCircles,
            bestKillstreak: data.stats.bestKillstreak,
            top10FinishRate: data.stats.gamesTop10 / data.stats.games,
            gulagWinRate: data.stats.winsGulag / data.stats.gamesGulag,
            timeMovingPercentage: (data.stats.percentTimeMoving / 100) / data.stats.games,
        }
    }
}

export const View = (props:Props) => {
    const uno = props.account.profiles.find(p => p.platform === 'uno')
    const cmdModifiers:string[] = []
    if (props._propsLoader?.limit) {
        cmdModifiers.push(`${props._propsLoader?.limit}d`)
        if (props._propsLoader?.skip) {
            cmdModifiers.push(`${props._propsLoader?.skip}d`)
        }
    }
    const fullCommand = `% wz barracks ${uno?.username} ${cmdModifiers.join(' ')}`
    return (
        <BarracksWrapper>
            <CommandWrapper>
                {fullCommand}
                <i className="icon-content_copy report-hidden" title="Copy to clipboard" onClick={() => navigator?.clipboard?.writeText(fullCommand)} />
            </CommandWrapper>
            <div className="box small">
            <div className="content">
                <h3 className="color-caption">
                    Rank
                </h3>
                <hr />
                <h2 className="color-highlight">
                    { props.rank.label }
                </h2>
                <img className="rank" alt="Gold Rank"
                    src={`/assets/images/ranks/${props.rank.id}.png`} />
                <div className="stat">
                    <h2>
                        &nbsp;
                    </h2>
                    <label>
                        &nbsp;
                        <small>&nbsp;</small>
                    </label>
                </div>
            </div>
            </div>

            <div className="box small" style={{top: -25}}>
            <div className="content watch">
                <h3 className="color-caption">
                    Boots on the Ground
                </h3>
                <hr />
                <div className="stat">
                    <h2>
                        {commaNum(props.stats.wins)}
                    </h2>
                    <label>
                        WINS
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaNum(props.stats.games)}
                    </h2>
                    <label>
                        GAMES
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaToFixed(props.stats.timePlayed / 60 / 60, 1)}hr
                    </h2>
                    <label>
                        TIME PLAYED
                        <small>IN-GAME ONLY</small>
                    </label>
                </div>
            </div>
            </div>

            <div className="box small" style={{top: -25}}>
            <div className="content knives">
                <h3 className="color-caption">
                    Victory and Defeat
                </h3>
                <hr />
                <div className="stat">
                    <h2 style={{marginTop: -8}}>
                        {Math.round(props.stats.avgFinish)}<sup>{ordinal(Math.round(props.stats.avgFinish)).replace(String(Math.round(props.stats.avgFinish)), '')}</sup>
                    </h2>
                    <label>
                        FINISH
                        <small>AVERAGE</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.stats.top10FinishRate * 100).toFixed(1)}%
                    </h2>
                    <label>
                        TOP 10
                        <small>PERCENTAGE</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.stats.gulagWinRate * 100).toFixed(1)}%
                    </h2>
                    <label>
                        GULAG WIN
                        <small>PERCENTAGE</small>
                    </label>
                </div>
            </div>
            </div>

            <div className="box">
            <div className="content inline hide-top">
                <h3 className="color-caption">
                    Kill or be Killed
                </h3>
                <hr />
                <div className="stat">
                    <h2>
                        {commaNum(props.stats.revives)}
                    </h2>
                    <label>
                        REVIVES
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.stats.timeMovingPercentage * 100).toFixed(1)}%
                    </h2>
                    <label>
                        TIME MOVING
                        <small>PERCENTAGE</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaNum(props.stats.finalCircles)}
                    </h2>
                    <label>
                        FINAL CIRCLES
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
            </div>

            <div className="content inline">
                <h3 className="color-caption">
                    Kill or be Killed
                </h3>
                <hr />
                <div className="stat">
                    <h2>
                        {commaToFixed(props.stats.damageDone / props.stats.games, 1)}
                    </h2>
                    <label>
                        DAMAGE
                        <small>AVG PER GAME</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaNum(props.stats.bestKillstreak)}
                    </h2>
                    <label>
                        KILLSTREAK
                        <small>HIGHEST EARNED</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaToFixed(props.stats.kills / props.stats.games, 2)}
                    </h2>
                    <label>
                        KILLS
                        <small>AVG PER GAME</small>
                    </label>
                </div>
            </div>

            <div className="content inline hide-top">
                <h3 className="color-caption">
                    Kill or be Killed
                </h3>
                <hr />
                <div className="stat">
                    <h2>
                        {(props.stats.kills / props.stats.deaths).toFixed(2)}
                    </h2>
                    <label>
                        K/D RATIO
                        <small>AVERAGE OVERALL</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.stats.damageDone / props.stats.damageTaken).toFixed(2)}
                    </h2>
                    <label>
                        DD/DT RATIO
                        <small>DMG DONE / TAKEN</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaToFixed(props.stats.score / (props.stats.timePlayed/60))}
                    </h2>
                    <label>
                        SCORE / MIN
                        <small>AVERAGE OVERALL</small>
                    </label>
                </div>
            </div>
            </div>
        </BarracksWrapper>
    )
}

