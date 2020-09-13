import { Normalize } from '@stagg/callofduty'
import Pie from '../../../../components/charts/Pie'

export default ({ performances }) => {
    const groups = {
        Solos: 0,
        Duos:  0,
        Trios: 0,
        Quads: 0,
    }
    for(const p of performances) {
        const mode = Normalize.MW.Modes[p.modeId]
        if (!mode) {
            console.log(`No mode for "${p.modeId}" in`, Normalize.MW.Modes)
            continue
        }
        if (p.stats.teamPlacement === 1) groups[Object.keys(groups)[mode.teamSize-1]]++
    }
    return <Pie groups={groups} />
}