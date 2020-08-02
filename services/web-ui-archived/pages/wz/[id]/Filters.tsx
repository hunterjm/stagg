import Link from 'next/link'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import cfg from '../../../config/ui'
import { colors } from '../[id]'
import Dropdown from '../../../components/Dropdown'

const FilterContainer = styled.div`
margin: 0.5rem;
background: rgba(255, 255, 255, 0.1);
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
width: 100%;
max-width: 1230px;
padding: 0.5rem;
border-radius: 0.25rem;
text-align: right;

label {
    font-size: 1.25rem;
    display: block;
    float: left;
    padding: 0 0.5rem;
}

.comparison-profile {
    display: inline-block;
    margin-right: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.5);
    font-size: 0.85rem;
    padding: 0 0.5rem 0.15rem 1rem;
    position: relative;
    bottom: -3px;

    .color {
        padding: 0.25rem;
        margin-left: -0.5rem;
        margin-right: 0.5rem;
    }
    .close {
        color: red;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.25rem;
        margin-right: -0.5rem;
        margin-left: 0.5rem;
        cursor: pointer;
    }
}

.filter-container {
    display: inline-block;
    max-width: 60%;
    font-size: 0.85rem;
    position: relative;
    z-index: 1;

    span {
        display: inline-block;
        position: relative;
        i {
            cursor: pointer;
            position: relative;
            bottom: 0;
            margin-left: 0.5rem;
            display: inline-block;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid transparent;
            border-right: none;
            padding: 0.35rem 0.5rem 0.4rem;
        }

        div {
            display: none;
        }

        .dropdown-container {
            display: none;
            position: relative;
            top: -4px;
        }

        input {
            display: none;
            position: relative;
            top: -1px;
            outline: none;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(0, 0, 0, 0.5);
            width: 4rem;
            text-align: left;
            color: rgba(255, 255, 255, 0.75);
            padding: 5px 0.5rem 5px;
            border-left: none;
        }

    }

    span.open {
        .dropdown-container, input, div {
            display: inline-block;
        }
    }
}
.comparison-container {
    overflow: auto;
    overflow-y: hidden;
    margin: -10px 0.5rem -10px;
    position: relative;
    top: -2px;
    ::-webkit-scrollbar-track {
        height: 6px;
        -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0.3);
        background-color: rgba(0, 0, 0, 0.25);
    }
    ::-webkit-scrollbar {
        height: 6px;
        background-color: none;
    }
    ::-webkit-scrollbar-thumb {
        height: 6px;
        background-color: rgba(0, 0, 0, 0.75);
    }
}
.input-container {
    display: inline-block;
    position: relative;
    z-index: 1;
    width: 12rem;
    .results {
        text-align: left;
        display: block;
        width: 100%;
        background: rgba(0, 0, 0, 0.75);
        border: 1px solid rgba(0, 0, 0, 0.95);
        position: absolute;
        top: 1.5rem;
        div {
            cursor: pointer;
            padding: 0.25rem 0.5rem;
        }
    }
    input[type="text"] {
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 0, 0, 0.5);
        outline: none;
        box-shadow: none;
        padding: 0.3rem 0.5rem 0.2rem;
        color: rgba(255, 255, 255, 0.75);
    }
}

`

export interface Filters {
    stats?: {
        [key:string]: {
            min?: number
            max?: number
        }
    }
    sort: {
        limit: number
        prop?:string
        stat?:string // use either prop or stat (prop is parent level p[prop], stat is p.stats[stat])
        order:number // 0 asc, 1 desc
    }
}

// Need to add a special case for downs
export const filterMap = [
    { stat: 'timePlayed',           label: 'Time Played' },
    { stat: 'teamPlacement',        label: 'Finish' },
    { stat: 'kills',                label: 'Kills' },
    { stat: 'deaths',               label: 'Deaths' },
    { stat: 'damageDone',           label: 'DMG Done' },
    { stat: 'damageTaken',          label: 'DMG Taken' },
    // { stat: 'teamSurvivalTime',     label: 'Survival Time' },
    { stat: 'eliminations',         label: 'Eliminations' },
    { stat: 'teamWipes',            label: 'Team Wipes' },
    { stat: 'revives',              label: 'Revives' },
    { stat: 'contracts',            label: 'Contracts' },
    { stat: 'lootCrates',           label: 'Loot Boxes' },
    { stat: 'buyStations',          label: 'Buy Stations' },
    { stat: 'gulagKills',           label: 'Gulag Kills' },
    { stat: 'gulagDeaths',          label: 'Gulag Deaths' },
    { stat: 'percentTimeMoving',    label: '% Time Moving' },
    { stat: 'distanceTraveled',     label: 'Distance Traveled' },
]
const sortMap = [
    { prop: 'startTime',        label: 'Date' },
    ...filterMap,
]

export default ({ username, performanceMap, setPerformanceMap, filters, setFilters }) => {
    const [limitOpen, setLimitOpen] = useState(false)
    const [sortOpen, setSortOpen] = useState(false)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [comparisonSearchInput, setComparisonSearchInput] = useState('')
    const [comparisonSearchResults, setComparisonSearchResults] = useState([])
    const [activeFilterKey, setActiveFilterKey] = useState(filterMap[0])
    const [activeSortKey, setActiveSortKey] = useState(sortMap[0])
    const sortDropdownItems = sortMap.map(s => ({ label: s.label, onClick:() => updateSort(s) }))
    const filterDropdownItems = filterMap.map(s => ({ label: s.label, onClick:() => setActiveFilterKey(s) }))
    const downloadProfile = async (username:string) => {
      const download = await fetch(`${cfg.api.host}/download?platform=uno&username=${encodeURIComponent(username)}`)
      const performances = await download.json()
      setPerformanceMap({...performanceMap, [username]: performances })
    }
    const updateComparisonSearch = async (input:string) => {
        setComparisonSearchInput(input)
        if (input.length > 1) {
            const search = await fetch(`${cfg.api.host}/search`, {
                method: 'POST',
                body: JSON.stringify({ username: input, platform: 'uno' })
            })
            const playerProfiles = await search.json()
            setComparisonSearchResults(playerProfiles.map(p => p.uno))
        }
    }
    const addProfileForComparison = async (username:string) => {
        setComparisonSearchInput('')
        await downloadProfile(username)
    }
    const removeProfileComparison = (username:string) => {
        const updatedPerformanceMap = { ...performanceMap }
        delete updatedPerformanceMap[username]
        setPerformanceMap(updatedPerformanceMap)
    }
    useEffect(() => { downloadProfile(username) }, [])
    const onFilterInputChange = (stat:string, type:'min'|'max', value:number) => {
        const updatedFilters = {
            ...filters,
            stats: {
                ...filters.stats,
                [stat]: { ...filters.stats[stat], [type]: value }
            }
        }
        setFilters(updatedFilters)
    }
    const onLimitInputChange = (limit:number) => {
        const updatedFilters = {
            ...filters,
            sort: {
                ...filters.sort,
                limit
            },
        }
        setFilters(updatedFilters)
    }
    const updateSort = (sortKey) => {
        setActiveSortKey(sortKey)
        const updatedFilters = {
            ...filters,
            sort: {
                ...filters.sort,
            }
        }
        delete updatedFilters.sort.prop
        delete updatedFilters.sort.stat
        updatedFilters.sort = { ...updatedFilters.sort, ...sortKey }
        setFilters(updatedFilters)
    }
    const sortOrder = !filters.sort.order ? 'asc' : 'desc'
    return (
        <FilterContainer>
            <label>{username}</label>

            <div className="filter-container">
                <span>
                    <i className="icon-spinner11" title="reset filters/sort/limit to default" onClick={() => setFilters()} />
                </span>
                <span className={filtersOpen ? 'open' : ''}>
                    <i onClick={() => setFiltersOpen(!filtersOpen)} className="icon-filter" title="filter matches by criteria" />
                    <span className="dropdown-container">
                        <Dropdown
                            activeItem={{ label: activeFilterKey.label, onClick: () => setActiveFilterKey(activeFilterKey)}}
                            items={filterDropdownItems} width="8rem" />
                    </span>
                    <input type="number" style={{width: '4rem'}}
                        onChange={e => onFilterInputChange(activeFilterKey.stat, 'min', Number(e.target.value))}
                        value={filters.stats[activeFilterKey.stat]?.min || ''}
                        placeholder="Min" min={0} />
                    <input type="number" style={{width: '4rem'}}
                        onChange={e => onFilterInputChange(activeFilterKey.stat, 'max', Number(e.target.value))}
                        value={filters.stats[activeFilterKey.stat]?.max || ''}
                        placeholder="Max" min={0} />
                </span>
                <span className={sortOpen ? 'open' : ''}>
                    <i onClick={() => setSortOpen(!sortOpen)} className={!filters.sort.order ? 'icon-sort-numeric-asc' : 'icon-sort-numberic-desc'} title={`sorting ${sortOrder} by criteria`} />
                    <span className="dropdown-container">
                        <Dropdown
                            activeItem={{ label: activeSortKey.label, onClick: () => updateSort(activeSortKey)}}
                            items={sortDropdownItems} width="8rem" />
                    </span>
                    <i className={`icon-sort-amount-${sortOrder}`} title={`currently sorting ${sortOrder}`} 
                        style={{marginLeft: 0, display: sortOpen ? 'inline-block' : 'none'}}
                        onClick={() => setFilters({...filters, sort: { ...filters.sort, order: Number(Boolean(!filters.sort.order)) }})} />
                </span>
                <span className={limitOpen ? 'open' : ''}>
                    <i onClick={() => setLimitOpen(!limitOpen)} className="icon-pagebreak" title="# of matches to keep after sorting" />
                    <input type="number" style={{width: '4rem'}}
                        onChange={e => onLimitInputChange(Number(e.target.value))}
                        value={filters.sort.limit}
                        placeholder="Limit" min={0} />
                </span>
                <span className={searchOpen ? 'open' : ''}>
                    <div className="comparison-container">
                    {
                        Object.keys(performanceMap).filter(uname => uname !== username)
                            .map(uname => (
                                <span key={uname} className="comparison-profile">
                                    <span className="color" style={{background: colors[Object.keys(performanceMap).indexOf(uname)]}}></span>
                                    <span><Link href="/wz/[id]" as={`/wz/${uname.split('#').join('@')}`}><a>{uname}</a></Link></span>
                                    <span className="close" onClick={() => removeProfileComparison(uname)}>X</span>
                                </span>
                            ))
                    }
                    </div>
                    <div className="input-container">
                        <input type="text" 
                            placeholder="Search players to compare..." 
                            value={comparisonSearchInput} 
                            onChange={e => updateComparisonSearch(e.target.value)} />
                        <div className="results" style={{display: comparisonSearchInput.length >=2 && comparisonSearchResults.length ? 'block' : 'none'}}>
                            {
                                comparisonSearchResults.map(uname => <div key={uname} onClick={() => addProfileForComparison(uname)}>{uname}</div>)
                            }
                        </div>
                    </div>
                    <i className={searchOpen ? 'icon-search' : /* icon-stack */ 'icon-search'} title="overlay + compare other players"
                        onClick={() => setSearchOpen(!searchOpen)} style={{marginLeft: '0.5rem', color: 'rgba(255, 255, 255, 0.75)'}} />
                </span>
            </div>
        </FilterContainer>
    )
}
