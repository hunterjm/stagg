import { useState, useRef } from 'react'
import { Schema } from 'callofduty'
import styled from 'styled-components'
import { MatchPreview } from './MatchPreview'
import { LineChart } from 'src/components/charts/Line'
import { useOnClickOutside } from 'src/hooks/clickOutside'

const Wrapper = styled.div`
    vertical-align: top;
    background: url('/cdn/callofduty/ui/bg.jpg');
    width: calc(50% - 6px);
    margin-left: 6px;
    margin-top: 6px;
    :nth-of-type(odd) {
        margin-left: 0;
        margin-right: 6px;
    }

    display: inline-block;
    border-radius: 4px;
    border: 1px solid #777;
    
    @media screen and (max-width: 768px) {
        width: 320px;
        margin-right: 0 !important;
        margin-left: 0 !important;
        margin-bottom: 32px !important;
    }

    .mode-card-header {
        height: 48px;
        position: relative;
        border-bottom: 1px solid #777;
        h4 {
            position: absolute;
            font-size: 28px;
            top: 6px;
            left: 0;
            right: 0;
            width: 100%;
            text-align: center;
            padding: 0;
            margin: 0;
        }
        img {
            width: 32px;
            margin-right: 12px;
            display: block;
            position: absolute;
            top: 6px;
            left: 6px;
        }
        .menu-container {
            position: absolute;
            top: 8px;
            right: 6px;
            cursor: pointer;

            .relative-container {
                position: relative;
            }

            ul.menu {
                position: absolute;
                right: 0;
                display: none;

                font-size: 12px;
                line-height: 12px;
                border: 1px solid #333;
                background: rgba(0, 0, 0, 0.8);
                list-style: none;
                margin: 0;
                padding: 0;

                li {
                    margin: 0;
                    padding: 3px 6px;
                    cursor: pointer;
                }

                li:hover, li.active {
                    background: rgba(255,255,255,0.3);
                }
                li.active {
                    color: #333;
                    background: rgba(255,255,255,0.8);
                    cursor: default;
                }
            }

            ul.menu.active {
                display: block;
            }
        }
    }

    .chart-area {
        background-color: rgba(0, 0, 0, 0.8);
    }
`

export interface ModeCardProps {
    gameId: Schema.Game
    gameType: Schema.GameType
}
export type MenuOption = 'SBMM'|'KDR'|'DDR'|'WLR'
export const ModeCard = ({ gameId, gameType, matchHistory }) => {
    const menuRef = useRef()
    const menuOptions:MenuOption[] = ['SBMM','KDR','DDR','WLR']
    const [menuActive, setMenuActive] = useState(false)
    const [chartStat, setChartStat] = useState<MenuOption>('SBMM')
    useOnClickOutside(menuRef, () => setMenuActive(false))
    const title = gameType === 'wz' ? 'Warzone' : 'Multiplayer'
    const iconFile = gameType === 'wz' ? 'mw.wz.br.png' : 'mw.mp.core.tdm.png'
    return (
        <Wrapper>
            <div className="mode-card-header">
                <h4>{title}</h4>
                <img src={`/cdn/callofduty/modes/${iconFile}`} alt={title} title={title} />
                <div className="menu-container">
                    <div className="relative-wrapper">
                        <i ref={menuRef} className="icon-cog" onClick={() => setMenuActive(!menuActive)} />
                        <ul ref={menuRef} className={['menu', menuActive ? 'active' : ''].join(' ')}>
                            {
                                menuOptions.map(option => (
                                    <li className={chartStat === option ? 'active' : ''} key={option} onClick={() => setChartStat(option)}>{option}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="chart-area">
                <LineChart labelType="none" lines={[
                    {
                        color: '#3f51b5',
                        label: 'KILLS',
                        data: matchHistory.slice(0,20).map((matchDetails) => matchDetails.kills)
                    }
                ]} />
            </div>
            <div>
                {
                    matchHistory.map((matchDetails) => (
                        <MatchPreview key={matchDetails.matchId} gameId={gameId} gameType={gameType} matchDetails={matchDetails} />
                    ))
                }
            </div>
        </Wrapper>
    )
}
