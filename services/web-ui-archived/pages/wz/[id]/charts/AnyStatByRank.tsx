import { useState } from 'react'
import Card from '../../../../components/Card'
import Dropdown from '../../../../components/Dropdown'
import StatByRank from './StatByRank'
import { filterMap } from '../Filters'
export default ({ colors, username, performanceMap }) => {
    const dropdownItemClicked = (filterMapItem) => {
        setStat(filterMapItem.stat)
        setActiveItem({ label: filterMapItem.label, onClick: () => dropdownItemClicked(filterMapItem)})
    }
    const dontShow = ['teamPlacement', 'distanceTraveled', 'timePlayed', 'gulagKills', 'gulagDeaths']
    const filters = filterMap.filter(s => !dontShow.includes(s.stat))
    const dropdownItems = filters.map(s => ({ label: s.label, onClick:() => dropdownItemClicked(s) }))
    const [stat, setStat] = useState(filters[0].stat)
    const [activeItem, setActiveItem] = useState(dropdownItems[0])
    const Label = (
        <span>
            <span style={{fontSize: '0.9rem', display: 'inline-block', position: 'relative', top: '-5px', marginRight: '0.5rem'}}>
                <Dropdown width="8.5rem" activeItem={activeItem} items={dropdownItems} />
            </span>
            by Finish
        </span>
    )
    return (
        <Card label={Label} large expandable>
            <StatByRank
                yStep={1}
                colors={colors}
                username={username}
                performanceMap={performanceMap}
                stat={stat} />
        </Card>
    )
}