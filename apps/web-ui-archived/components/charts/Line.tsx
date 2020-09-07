import ordinal from 'ordinal'
import { Line } from 'react-chartjs-2'

const colors = [
  '#ffa600',
  '#f95d6a',
  '#d45087',
  '#a05195',
  '#f95d6a',
  '#ff7c43',
]

const randomInt = (max:number):number => Math.floor(Math.random() * Math.floor(max))

interface Props {
  lines:{ label: string, data: number[], color?:string }[]
  xStep?:number
  yStep?:number
  expanded?:boolean
  labelType?:'ordinal'|'none'
}
export default ({expanded=false, lines, labelType='ordinal', yStep=10, xStep=1}:Props) => {
  const options = {
    legend: {
      display: false,
      labels: {
          fontColor: "rgba(255, 255, 255, 0.5)",
          fontSize: 18
      }
    },
    scales: {
        yAxes: [{
            ticks: {
                fontColor: "rgba(255, 255, 255, 0.5)",
                fontSize: 18,
                stepSize: yStep,
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                fontColor: "rgba(255, 255, 255, 0.5)",
                fontSize: 14,
                stepSize: xStep,
                beginAtZero: true
            }
        }]
    }
  }
  const data = {
    labels: [],
    datasets: []
  }
  const randomStartingColorIndex = randomInt(colors.length-1)
  for(const line of lines) {
    if (data.labels.length < line.data.length) data.labels = Object.keys(line.data).map(i => labelType === 'ordinal' ? ordinal(Number(i)+1) : '')
    const colorIndex = (randomStartingColorIndex + data.datasets.length) % colors.length
    const color = line.color ? line.color : colors[colorIndex]
    const genericDataset = {
      fill: false,
      lineTension: 0.1,
      backgroundColor: color,
      borderColor: color,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: color,
      pointBackgroundColor: 'rgba(255, 255, 255, 0.5)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    }
    const avg = line.data.reduce((a,b) => a+b, 0) / line.data.length
    data.datasets.push({
      ...genericDataset,
      label: `(AVG) ${line.label}`,
      data: line.data.map(() => avg),
      borderColor: 'rgba(255, 255, 255, 0.33)',
      backgroundColor: 'rgba(255, 255, 255, 0.33)',
      pointBorderColor: 'rgba(255, 255, 255, 0.33)',
      pointBackgroundColor: 'rgba(255, 255, 255, 0.33)',
      pointHoverBackgroundColor: 'rgba(255, 255, 255, 0.33)',
    })
    data.datasets.push({
      ...genericDataset,
      label: line.label,
      data: line.data
    })
  }
  options.legend.display = expanded
  return <Line options={options} data={data} />
}