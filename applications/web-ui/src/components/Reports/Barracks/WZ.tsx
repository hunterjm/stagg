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
    results: {
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
    if (!propsAsComplete.results) {
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

export const PropsLoader = async ({ accountIdentifier }:ReportLazyLoadProps, limit:string='', skip:string='') => {
    if (!accountIdentifier.uno) {
        throw 'uno username required'
    }
    const apiUrlBase = `/callofduty/db/uno/${encodeURIComponent(accountIdentifier.uno)}/wz`
    const apiUrlFilters = `?limit=${limit}&skip=${skip}&modesExcluded=dmz`
    const { data } = await request<any>(apiUrlBase + apiUrlFilters)
    if (!data.account) {
        return null
    }
    return {
        _propsLoader: { limit, skip },
        account: data.account.callofduty,
        rank: data.rank,
        results: {
            ...data.results,
            avgFinish: Math.round(data.results.teamPlacement / data.results.games) || 0,
            top10FinishRate: data.results.gamesTop10 / data.results.games,
            gulagWinRate: data.results.winsGulag / data.results.gamesGulag,
            timeMovingPercentage: (data.results.percentTimeMoving / 100) / data.results.games,
        }
    }
}

export const View = (props:Props) => {
    const uno = props.account.profiles.find(p => p.platform === 'uno')
    const cmdModifiers:string[] = []
    if (props._propsLoader?.limit) {
        cmdModifiers.push(`${props._propsLoader?.limit}`)
        if (props._propsLoader?.skip) {
            cmdModifiers.push(`${props._propsLoader?.skip}`)
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
                        {commaNum(props.results.wins)}
                    </h2>
                    <label>
                        WINS
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaNum(props.results.games)}
                    </h2>
                    <label>
                        GAMES
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaToFixed(props.results.timePlayed / 60 / 60, 1)}hr
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
                        {Math.round(props.results.avgFinish)}<sup>{ordinal(Math.round(props.results.avgFinish)).replace(String(Math.round(props.results.avgFinish)), '')}</sup>
                    </h2>
                    <label>
                        FINISH
                        <small>AVERAGE</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.results.top10FinishRate * 100).toFixed(1)}%
                    </h2>
                    <label>
                        TOP 10
                        <small>PERCENTAGE</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.results.gulagWinRate * 100).toFixed(1)}%
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
                        {commaNum(props.results.revives)}
                    </h2>
                    <label>
                        REVIVES
                        <small>TOTAL NUMBER</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.results.timeMovingPercentage * 100).toFixed(1)}%
                    </h2>
                    <label>
                        TIME MOVING
                        <small>PERCENTAGE</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaNum(props.results.finalCircles)}
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
                        {commaToFixed(props.results.damageDone / props.results.games, 1)}
                    </h2>
                    <label>
                        DAMAGE
                        <small>AVG PER GAME</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaNum(props.results.bestKillstreak)}
                    </h2>
                    <label>
                        KILLSTREAK
                        <small>HIGHEST EARNED</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaToFixed(props.results.kills / props.results.games, 2)}
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
                        {(props.results.kills / props.results.deaths).toFixed(2)}
                    </h2>
                    <label>
                        K/D RATIO
                        <small>AVERAGE OVERALL</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {(props.results.damageDone / props.results.damageTaken).toFixed(2)}
                    </h2>
                    <label>
                        DD/DT RATIO
                        <small>DMG DONE / TAKEN</small>
                    </label>
                </div>
                <div className="stat">
                    <h2>
                        {commaToFixed(props.results.score / (props.results.timePlayed/60))}
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

