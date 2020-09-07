import { Pie } from 'react-chartjs-2'

const options = { maintainAspectRatio: false, legend: { display: false }, tooltips: { enabled: true } }

export interface Props {
	data: {
		[key:string]: number // label: count
	}
}
export default ({ groups }) => {
	const data = {
		labels: Object.keys(groups),
		datasets: [{
			data: Object.values(groups),
			backgroundColor: [
				'#003f5c',
				'#2f4b7c',
				'#665191',
				'#a05195',
				'#d45087',
				'#f95d6a',
				'#ff7c43',
				'#ffa600',
			],
			hoverBackgroundColor: [
				'#003f5c',
				'#2f4b7c',
				'#665191',
				'#a05195',
				'#d45087',
				'#f95d6a',
				'#ff7c43',
				'#ffa600',
			]
		}]
	}
	return <Pie options={options} data={data} />
}