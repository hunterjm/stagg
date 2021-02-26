import * as Assets from '@callofduty/assets'
import * as Schema from '@callofduty/types'
import styled from 'styled-components'
import dateFormat from 'dateformat'
import ordinal from 'ordinal'

// Assets.MW.Maps.mp_aniyah

const Wrapper = styled.div(({ mapId }:any) => `
    position: relative;
    text-align: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0% 50%;
    border-bottom: 1px solid #777;
    background-image: url('${Assets.MW.Maps[mapId].images.thumbnail}');
    :last-child {
        border-bottom: none;
    }
    small {
        font-size: 0.8em;
        line-height: 0.8em;
        padding: 1px;
    }
    .match-rank-time {
        display: inline-block;
        color: white;
        position: relative;
        z-index: 1;
        font-size: 14px;
        span.rank, span.time-total {
            display: inline-block;
            border: 1px solid rgba(0, 0, 0, 0.6);
            background: rgba(255, 255, 0, 0.4);
            font-size: 12px;
            position: relative;
            bottom: -1px;
            line-height: 1em;
            text-align: center;
            padding: 2px 2px;
        }
        span.time-total {
            background: rgba(0, 0, 0, 0.4);
        }
        small.time-start {
            display: block;
        }
    }
    .map-mode-info {
        width: 8em;
        display: inline-block;
        position: relative;
        z-index: 1;
        text-align: left;
        padding: 12px;
        p {
            margin: 0;
            padding: 0;
            color: white;
            margin-top: 4px;
            font-size: 0.8em;
            line-height: 0.8em;
        }
        p:first-of-type {
            margin-top: 0;
        }
    }
    .match-stat-summary {
        position: absolute;
        top: 2px; right: 0; bottom: 0;
        p {
            padding: 8px;
            display: inline-block;
            font-size: 0.8em;
            * {
                display: block;
                text-align: center;
            }
            span {
                color: white;
            }
        }
    }
    
    @media screen and (max-width: 768px) {
        .match-rank-time {
            display: none;
        }
        .match-stat-summary > p {
            display: none;
        }
        .match-stat-summary > p:nth-of-type(1),
        .match-stat-summary > p:nth-of-type(2),
        .match-stat-summary > p:nth-of-type(3) {
            display: inline-block;
        }
    }
`) as any

const DimOverlay = styled.div`
    z-index: 0;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    height: 100%; width: 100%;
    background: rgba(0,0,0,0.6);
`

const OutcomeIndicator = styled.div(({ color }:any) => `
    position: absolute;
    z-index: 1;
    left: 0; top: 8px; bottom: 8px;
    border-left: 4px solid ${color};
`) as any

export interface ModeCardProps {
    gameId?: Schema.Game
    gameType?: Schema.GameType,
    matchDetails: any //{ matchId:string, modeId:string, mapId:string, startTime: number, endTime: number }
}
export const MatchPreview = ({
    gameType,
    matchDetails: {
        mapId,
        matchId,
        modeId,
        startTime,
        endTime,
        kills,
        deaths,
        damageDone,
        damageTaken,
        percentTimeMoving,
        score,
        timePlayed,
        teamPlacement,
        teamId,
        scoreAxis,
        scoreAllies,
    }
}:ModeCardProps) => {
    if (!Assets.MW.Maps[mapId]) {
        console.log('No map info for', mapId)
        return null
    }
    if (!Assets.MW.Modes[modeId]) {
        console.log('No mode info for', modeId)
        return null
    }
    const elapsedTime = endTime - startTime
    const readableElapsedTime = `${Math.floor(elapsedTime / 60)}m ${elapsedTime % 60}s`
    const optionalClassValue = gameType === 'wz' ? ordinal(teamPlacement) : readableElapsedTime
    const optionalClassname = gameType === 'wz' ? 'rank' : 'time-total'
    let color = 'gray'
    if (gameType === 'wz') {
        color = 'red'
        if (teamPlacement <= 10) {
            color = 'yellow'
        }
        if (teamPlacement === 1) {
            color = 'green'
        }
    } else {
        if (teamId === 'allies') {
            if (scoreAllies < scoreAxis) {
                color = 'red'
            }
            if (scoreAllies > scoreAxis) {
                color = 'green'
            }
            if (scoreAllies === scoreAxis) {
                color = 'yellow'
            }
        } else {
            if (scoreAllies > scoreAxis) {
                color = 'red'
            }
            if (scoreAllies < scoreAxis) {
                color = 'green'
            }
            if (scoreAllies === scoreAxis) {
                color = 'yellow'
            }
        }
    }
    return (
        <Wrapper mapId={mapId}>
            <DimOverlay />
            <OutcomeIndicator color={color} />
            <div className="map-mode-info">
                <p>{Assets.MW.Modes[modeId].name}</p>
                <p><small>{Assets.MW.Maps[mapId].name}</small></p>
            </div>
            <div className="match-rank-time">
                <span className={optionalClassname}>{optionalClassValue}</span>
                <small className="time-start">{dateFormat(new Date(endTime * 1000), 'h:MMtt')}</small>
            </div>
            <div className="match-stat-summary">
                <p>
                    <small>KILLS</small>
                    <span>{kills}</span>
                </p>
                <p>
                    <small>KDR</small>
                    <span>{(kills/(deaths||1)).toFixed(2)}</span>
                </p>
                <p>
                    <small>DDR</small>
                    <span>{(damageDone/(damageTaken||1)).toFixed(2)}</span>
                </p>
                <p>
                    <small>SPM</small>
                    <span>{Math.round(score/((timePlayed||1)/60))}</span>
                </p>
                <p>
                    <small>PTM</small>
                    <span>{Math.round(percentTimeMoving)}%</span>
                </p>
            </div>
        </Wrapper>
    )
}
// https\:\/\/www\.callofduty\.com\/cdn\/app\/base-maps\/mw\/mp_don3\.jpg