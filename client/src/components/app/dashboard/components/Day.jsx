import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const Day = ({ day, rowIndex, monthIndex, chemicals, dayBeforeExp }) => {
	const navigate = useNavigate()

	const today = day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
	const currentMonth = day.format('M') === dayjs().month(monthIndex).format('M')

	const [expiringChemicals, setExpiringChemicals] = useState([])
	const [expiredChemicals, setExpiredChemicals] = useState([])

	useEffect(() => {
		const expiringChemicals = chemicals.filter(
			(chemical) =>
				dayjs(chemical.expirationDate)
					.subtract(dayBeforeExp, 'day')
					.format('DD-MM-YY') === day.format('DD-MM-YY')
		)

		setExpiringChemicals(expiringChemicals)

		const expiredChemicals = chemicals.filter(
			(chemical) =>
				dayjs(chemical.expirationDate).format('DD-MM-YY') ===
				day.format('DD-MM-YY')
		)

		setExpiredChemicals(expiredChemicals)
	}, [chemicals, day, dayBeforeExp])

	return (
		<div className='flex flex-col border border-gray-200 py-2 px-4'>
			<div className='flex flex-col items-center'>
				{rowIndex === 0 && (
					<p className='mb-1 text-xs font-medium text-gray-500'>
						{day.format('ddd').toUpperCase()}
					</p>
				)}

				<p
					className={`mb-1 p-1 text-center text-sm ${
						currentMonth ? '' : 'text-gray-400'
					}${
						today
							? 'h-7 w-7 rounded-full bg-indigo-600 font-medium text-white'
							: ''
					}`}
				>
					{day.format('DD')}
				</p>

				<div className='min-h-[1.25rem] w-full space-y-2 text-sm'>
					{expiringChemicals.length === 0
						? ''
						: expiringChemicals.map((chemical) => (
								<div
									onClick={() => navigate(`/inventory/${chemical._id}`)}
									className={`-ml-4 truncate rounded-tr-full rounded-br-full bg-yellow-100 px-2 py-0.5 font-semibold text-yellow-600 transition ${
										currentMonth
											? 'cursor-pointer'
											: 'pointer-events-none opacity-50'
									}`}
									key={chemical._id}
								>
									{chemical.name}
								</div>
						  ))}

					{expiredChemicals.length === 0
						? ''
						: expiredChemicals.map((chemical) => (
								<div
									onClick={() => navigate(`/inventory/${chemical._id}`)}
									className={`-ml-4 truncate rounded-tr-full rounded-br-full bg-red-100 px-2 py-0.5 font-semibold text-red-600 transition ${
										currentMonth
											? 'cursor-pointer'
											: 'pointer-events-none opacity-50'
									}`}
									key={chemical._id}
								>
									{chemical.name}
								</div>
						  ))}
				</div>
			</div>
		</div>
	)
}

export default Day
