import Pie from '../../../../components/charts/Pie'

export default ({ performances }) => {
    const groups = {}
    for(const p of performances) {
        for(const circleIndex in p.stats.downs) {
            const i = Number(circleIndex)
            const key = `Circle #${i+1}`
            if (!groups[key]) groups[key] = 0
            groups[key] += p.stats.downs[i]
        }
    }
    return <Pie groups={groups} />
}