import ordinal from 'ordinal'
import { useEffect, useState } from 'react'
import * as Schema from '@callofduty/types'
import * as Assets from '@callofduty/assets'
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
        weapon: {
            id: Schema.MW.Weapon.Name
            kills: number
        }
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

export const LazyLoader = ({ accountIdentifier }:ReportLazyLoadProps) => {
    const [reportProps, setReportProps] = useState<Props>(null)
    const loader = async () => {
        const props = await PropsLoader({ accountIdentifier })
        setReportProps(null)
    }
    useEffect(() => { !reportProps ? loader() : null })
    if (!reportProps) {
        return (
            <>Loading...</>
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
    return {
        account: data.account.callofduty,
        stats: {
            wins: data.stats.wins,
            score: data.stats.score,
            games: data.stats.games,
            kills: data.stats.kills,
            deaths: data.stats.deaths,
            timePlayed: data.stats.timePlayed,
            bestKillstreak: data.stats.bestKillstreak,
            timeMovingPercentage: (data.stats.percentTimeMoving / 100) / data.stats.games,
        }
    }
}

export const View = (props:Props) => {let rank = 'Bronze'
if (props.stats.avgFinish <= 15 || props.stats.kills / props.stats.deaths >= 0.8 || props.stats.damageDone / props.stats.damageTaken >= 2) {
    rank = 'Silver'
}
if (props.stats.avgFinish <= 10 || props.stats.kills / props.stats.deaths >= 1.5 || props.stats.damageDone / props.stats.damageTaken >= 5) {
    rank = 'Gold'
}
const uno = props.account.profiles.find(p => p.platform === 'uno')
const weapon = Assets.MW.Weapons[props.stats.weapon.id]
return (
    <BarracksWrapper>
        <CommandWrapper>% mw barracks {uno?.username}</CommandWrapper>
        <div className="box small">
        <div className="content">
            <h3 className="color-caption">
                Weapon of Choice
            </h3>
            <hr />
            <h2 className="color-highlight">
                {weapon.name}
            </h2>
            <img className="weapon" alt="AK-47"
                src={weapon.image} />
            <div className="stat">
                <h2>
                    {commaNum(props.stats.weapon.kills)}
                </h2>
                <label>
                    KILLS
                    <small>TOTAL NUMBER</small>
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

