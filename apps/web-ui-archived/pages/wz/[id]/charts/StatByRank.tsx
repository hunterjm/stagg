import Line from '../../../../components/charts/Line'
export default ({ username, performanceMap, stat, xStep=0, yStep=0, colors=[] }) => {
    const lines = []
    for(const uname in performanceMap) {
        const performances = performanceMap[uname]
        const finishPosStats = []
        for(const p of performances) {
            const key = p.stats.teamPlacement - 1
            if (!finishPosStats[key]) finishPosStats[key] = { games: 0, stats: {} }
            finishPosStats[key].games++
            for(const statKey in p.stats) {
              if (statKey === 'xp') continue // skip xp for now (its nested)
                if (!finishPosStats[key].stats[statKey]) finishPosStats[key].stats[statKey] = 0
                finishPosStats[key].stats[statKey] += statKey === 'downs' ? p.stats.downs.reduce((a,b) => a+b, 0) : p.stats[statKey]
            }
        }
        lines.push({ label: uname.split('#')[0], data: finishPosStats.map(f => f.stats[stat] / f.games), color: colors[lines.length] || '#00ff00' })
    }
    return <Line xStep={xStep} yStep={yStep} lines={lines} />
}
// make colors for players consistent and put color codes in tags from search