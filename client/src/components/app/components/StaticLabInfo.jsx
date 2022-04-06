import React from 'react'
import { UserIcon, BeakerIcon } from '@heroicons/react/outline'

const StaticLabInfo = ({ labUsersNo, chemicalsNo }) => {
	return (
		<>
			<label>No. of Users & Chemicals</label>
			<div className='flex space-x-12'>
				<div className='flex items-center space-x-3'>
					<UserIcon className='h-6 w-6 text-gray-400' />
					<p className='text-lg font-medium'>
						{labUsersNo}
						<span className='ml-1.5 text-sm font-normal'>
							{labUsersNo > 1 ? 'Users' : 'User'}
						</span>
					</p>
				</div>

				<div className='flex items-center space-x-3'>
					<BeakerIcon className='h-6 w-6 text-gray-400' />
					<p className='text-lg font-medium'>
						{chemicalsNo}
						<span className='ml-1.5 text-sm font-normal'>
							{chemicalsNo > 1 ? 'Chemicals' : 'Chemical'}
						</span>
					</p>
				</div>
			</div>
		</>
	)
}

export default StaticLabInfo
