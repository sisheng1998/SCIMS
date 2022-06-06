import React from 'react'
import { Bar } from 'react-chartjs-2'

const BarChart = ({ info, chemicals, users, type, unit, indexAxis }) => {
	let usersWithCount = []
	let chemicalsWithUsages = []

	if (type === 'Users/Records') {
		users.forEach((user) => {
			const count = info.filter((log) => log.user._id === user._id).length
			usersWithCount.push({
				...user,
				count,
			})
		})
	} else {
		const filteredInfo = info.filter((log) => log.chemical.unit === unit)

		if (type === 'Name') {
			chemicals.forEach((chemical) => {
				const totalUsages = filteredInfo
					.filter((log) => log.chemical._id === chemical._id)
					.map((log) => log.usage)
					.reduce((prev, curr) => prev + curr, 0)

				if (totalUsages !== 0) {
					chemicalsWithUsages.push({
						name: chemical.name,
						usage: totalUsages,
					})
				}
			})
		} else {
			chemicals
				.filter(
					(e, i) => chemicals.findIndex((a) => a['CASNo'] === e['CASNo']) === i
				)
				.forEach((chemical) => {
					const totalUsages = filteredInfo
						.filter((log) => log.chemical.CASId.CASNo === chemical.CASNo)
						.map((log) => log.usage)
						.reduce((prev, curr) => prev + curr, 0)

					if (totalUsages !== 0) {
						chemicalsWithUsages.push({
							name: `${chemical.chemicalName} (${chemical.CASNo})`,
							usage: totalUsages,
						})
					}
				})
		}
	}

	const processedData =
		type === 'Users/Records'
			? usersWithCount.sort((a, b) => b.count - a.count).slice(0, 10)
			: chemicalsWithUsages.sort((a, b) => b.usage - a.usage).slice(0, 10)

	const data = {
		labels:
			type === 'Users/Records'
				? processedData.map((user) => user.name)
				: processedData.map((chemical) => chemical.name),
		datasets: [
			{
				label: type === 'Users/Records' ? 'No. of Records' : 'Usages',
				data:
					type === 'Users/Records'
						? processedData.map((user) => user.count)
						: processedData.map((chemical) => chemical.usage),
				backgroundColor: [
					'#dcfce7',
					'#dbeafe',
					'#fef9c3',
					'#fee2e2',
					'#f3e8ff',
					'#ffedd5',
					'#cffafe',
					'#e0e7ff',
					'#fae8ff',
					'#ecfccb',
				],
				borderColor: [
					'#16a34a',
					'#2563eb',
					'#ca8a04',
					'#dc2626',
					'#9333ea',
					'#ea580c',
					'#0891b2',
					'#4f46e5',
					'#c026d3',
					'#65a30d',
				],
				borderWidth: 1,
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: indexAxis,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (context) =>
						` ${context.dataset.label}: ${context.raw} ${
							type === 'Users/Records' ? '' : unit
						}`,
				},
			},
		},
	}

	return (
		<div
			className={
				indexAxis === 'y'
					? `relative mt-2 h-[${50 + processedData.length * 50}px]`
					: 'relative mt-3 h-96'
			}
		>
			<Bar data={data} options={options} />
		</div>
	)
}

export default BarChart
