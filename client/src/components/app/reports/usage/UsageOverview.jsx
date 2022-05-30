import React from 'react'
import InfoCard from '../InfoCard'
import {
	ClockIcon,
	BeakerIcon,
	UserIcon,
	ClipboardListIcon,
} from '@heroicons/react/outline'

const UsageOverview = ({ data, dateRanges }) => {
	let involvedChemicals = []
	let involvedUsers = []

	data.forEach((log) => {
		!involvedChemicals.includes(log.chemical._id) &&
			involvedChemicals.push(log.chemical._id)

		!involvedUsers.includes(log.user._id) && involvedUsers.push(log.user._id)
	})

	return (
		<div className='-mr-4 mb-2 flex flex-wrap'>
			<InfoCard
				icon={
					<ClockIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
				}
				value='Report Period'
				text={
					<>
						{dateRanges.start}
						<span className='mx-1.5 text-xs text-gray-400'>→</span>
						{dateRanges.end}
					</>
				}
			/>

			<InfoCard
				icon={
					<BeakerIcon className='h-14 w-14 rounded-full bg-indigo-50 p-3 text-indigo-500' />
				}
				value={involvedChemicals.length}
				text='Involved Chemical'
				haveLetterS={true}
			/>

			<InfoCard
				icon={
					<UserIcon className='h-14 w-14 rounded-full bg-pink-50 p-3 text-pink-500' />
				}
				value={involvedUsers.length}
				text='Involved User'
				haveLetterS={true}
			/>

			<InfoCard
				icon={
					<ClipboardListIcon className='h-14 w-14 rounded-full bg-green-50 p-3 text-green-500' />
				}
				value={data.length}
				text='Usage Record'
				haveLetterS={true}
			/>
		</div>
	)
}

export default UsageOverview
