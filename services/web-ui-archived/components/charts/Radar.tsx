import { Radar } from 'react-chartjs-2'

const options = {
  maintainAspectRatio: false,
  scale: {
    ticks: {
      beginAtZero: true
    }
  },
  legend: { display: false },
  tooltips: { enabled: true }
}
const colors = [
  '179,181,198',
  '255,99,132',
  '145,231,23',
  '85,33,233',
]

  export default ({ groups }) => {
    const data = {
      labels: Object.keys(groups),
      datasets: Object.keys(groups).map((label,i) => ({
        label,
        backgroundColor: `rgba(${colors[i]}, 0.2)`,
        borderColor: `rgba(${colors[i]}, 1)`,
        pointBackgroundColor: `rgba(${colors[i]}, 1)`,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: `rgba(${colors[i]}, 1)`,
        data: groups[label]
      }))
    }
    return <Radar options={options} data={data} />
  }