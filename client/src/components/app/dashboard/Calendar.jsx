import React, { useState, useEffect } from 'react'
import Month from './components/Month'
import GetMonth from './components/GetMonth'
import CalendarHeader from './components/CalendarHeader'
import dayjs from 'dayjs'

const Calendar = ({ chemicals, dayBeforeExp }) => {
	const [currentMonth, setCurrentMonth] = useState(GetMonth())
	const [monthIndex, setMonthIndex] = useState(dayjs().month())

	useEffect(() => {
		setCurrentMonth(GetMonth(monthIndex))
	}, [monthIndex])

	return (
		<div className='max-w-6xl flex-1'>
			<p className='mb-2 font-medium text-gray-500'>
				Calendar{' '}
				<span className='text-xs text-gray-400'>
					(Chemical Expiration Date)
				</span>
			</p>

			<div className='flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
				<CalendarHeader
					monthIndex={monthIndex}
					setMonthIndex={setMonthIndex}
					dayBeforeExp={dayBeforeExp}
				/>
				<Month
					month={currentMonth}
					monthIndex={monthIndex}
					chemicals={chemicals}
					dayBeforeExp={dayBeforeExp}
				/>
			</div>
		</div>
	)
}

export default Calendar
