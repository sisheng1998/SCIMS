import React from 'react'
import { useLocation } from 'react-router-dom'
import Day from './Day'

const Month = ({ month, monthIndex, chemicals, dayBeforeExp }) => {
	const { pathname } = useLocation()

	return (
		<div
			className={`grid flex-1 grid-cols-7 grid-rows-5 ${
				pathname.includes('/admin') ? 'pointer-events-none' : ''
			}`}
		>
			{month.map((row, rowIndex) => (
				<React.Fragment key={rowIndex}>
					{row.map((day, dayIndex) => (
						<Day
							key={dayIndex}
							day={day}
							monthIndex={monthIndex}
							rowIndex={rowIndex}
							chemicals={chemicals}
							dayBeforeExp={dayBeforeExp}
						/>
					))}
				</React.Fragment>
			))}
		</div>
	)
}

export default Month
