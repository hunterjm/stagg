import { Map } from '@stagg/api'
import Polar from '../../../../components/charts/Polar'

export default ({ performances }) => {
    const groups = {
        Solos: [0, 0],
        Duos:  [0, 0],
        Trios: [0, 0],
        Quads: [0, 0],
    }
    for(const p of performances) {
        const mode = Map.CallOfDuty.MW.Modes[p.modeId]
        if (!mode) continue
        const teamSizeLabels = ['Solos', 'Duos', 'Trios', 'Quads']
        groups[teamSizeLabels[mode.teamSize-1]][0]++
        if (p.stats.teamPlacement > 0 && p.stats.teamPlacement <= 10) groups[teamSizeLabels[mode.teamSize-1]][1]++
    }
    for(const key in groups) {
        groups[key] = [ Math.round((groups[key][1] / groups[key][0]) * 100) ]
    }
    return <Polar groups={groups} percentage={true} />
}