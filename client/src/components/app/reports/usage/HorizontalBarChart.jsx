import React from 'react'
import { Bar } from 'react-chartjs-2'

const HorizontalBarChart = ({ info, chemicals, users }) => {
	const data = {
		labels: users.map((user) => user.name),
		datasets: [
			{
				label: 'No. of records',
				data: [10, 2, 1, 3, 2],
				backgroundColor: [
					'#dcfce7',
					'#dbeafe',
					'#fef9c3',
					'#fee2e2',
					'#f3e8ff',
				],
				borderColor: ['#16a34a', '#2563eb', '#ca8a04', '#dc2626', '#9333ea'],
				borderWidth: 1,
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: 'y',
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (context) =>
						` ${context.parsed} Chemical${context.parsed > 1 ? 's' : ''} (${
							context.label
						})`,
				},
			},
		},
	}

	return <Bar data={data} options={options} />
}

export default HorizontalBarChart
