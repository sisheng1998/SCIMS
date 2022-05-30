import React, { useState } from 'react'
import dayjs from 'dayjs'

const today = dayjs().format('YYYY-MM-DD')
const firstDayOfThisMonth = dayjs().startOf('month').format('YYYY-MM-DD')
const lastDayOfLastMonth = dayjs()
	.subtract(1, 'month')
	.endOf('month')
	.format('YYYY-MM-DD')
const firstDayOfLastMonth = dayjs()
	.subtract(1, 'month')
	.startOf('month')
	.format('YYYY-MM-DD')
const firstDayOfThisYear = dayjs().startOf('year').format('YYYY-MM-DD')

const getOption = (dateRanges) => {
	let option

	if (dateRanges.start === firstDayOfThisMonth && dateRanges.end === today) {
		option = 'thisMonth'
	} else if (
		dateRanges.start === firstDayOfLastMonth &&
		dateRanges.end === lastDayOfLastMonth
	) {
		option = 'lastMonth'
	} else if (
		dateRanges.start === firstDayOfThisYear &&
		dateRanges.end === today
	) {
		option = 'thisYear'
	} else {
		option = 'custom'
	}

	return option
}

const DateRangesFilter = ({ dateRanges, setDateRanges }) => {
	const [option, setOption] = useState(getOption(dateRanges))
	const [startDate, setStartDate] = useState(dateRanges.start)
	const [endDate, setEndDate] = useState(dateRanges.end)

	const disabled =
		!startDate ||
		!endDate ||
		(startDate === dateRanges.start && endDate === dateRanges.end)

	const dateHandler = (value) => {
		setOption(value)

		if (value === 'thisMonth') {
			setDateRanges({
				start: firstDayOfThisMonth,
				end: today,
			})
		} else if (value === 'lastMonth') {
			setDateRanges({
				start: firstDayOfLastMonth,
				end: lastDayOfLastMonth,
			})
		} else if (value === 'thisYear') {
			setDateRanges({
				start: firstDayOfThisYear,
				end: today,
			})
		}
	}

	return (
		<div className='mb-5 flex items-center text-sm text-gray-500'>
			<p>Period</p>

			<select
				className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
				name='periodFilter'
				id='periodFilter'
				value={option}
				onChange={(e) => dateHandler(e.target.value)}
			>
				<option value='thisMonth'>This Month</option>
				<option value='lastMonth'>Last Month</option>
				<option value='thisYear'>This Year</option>
				<option value='custom'>Custom</option>
			</select>

			{option === 'custom' && (
				<>
					<p className='ml-4 mr-2'>Range</p>
					<input
						className='p-1 px-2 text-sm text-gray-700'
						type='date'
						name='startDate'
						id='startDate'
						max={today}
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<p className='mx-2'>→</p>
					<input
						className='p-1 px-2 text-sm text-gray-700'
						type='date'
						name='endDate'
						id='endDate'
						max={today}
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>

					<button
						className='button button-outline ml-3 px-4 py-1 font-medium'
						onClick={() =>
							setDateRanges({
								start: startDate,
								end: endDate,
							})
						}
						disabled={disabled}
					>
						Filter
					</button>
				</>
			)}
		</div>
	)
}

export default DateRangesFilter
