import React from 'react'
import HorizontalBarChart from './HorizontalBarChart'

const Analytics = ({ data, chemicals, users }) => {
	return (
		<div className='flex space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
			<div className='w-full max-w-xs'>sidebar</div>

			<div className='relative h-96 flex-1'>
				<HorizontalBarChart info={data} chemicals={chemicals} users={users} />
			</div>
		</div>
	)
}

export default Analytics
