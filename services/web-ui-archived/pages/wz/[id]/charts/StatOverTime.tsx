import Line from '../../../../components/charts/Line'

export default ({ username, performanceMap, colors=[], stat, xStep=0, yStep=0, color='' }) => {
    const lines = []
    for(const uname in performanceMap) {
        lines.push({
            color: colors[lines.length],
            label: uname.split('#')[0],
            data: performanceMap[uname].map(p => {
                if (typeof stat === typeof 'str') return p.stats[stat]
                let quotient = p.stats[stat.divisor]/p.stats[stat.dividend]
                if (isNaN(quotient)) {
                    quotient = p.stats[stat.dividend]
                }
                if (quotient === Infinity) {
                    quotient = p.stats[stat.divisor]
                }
                return quotient
            })
        })
    }
    return <Line lines={lines} xStep={xStep} yStep={yStep} labelType="none" />
}