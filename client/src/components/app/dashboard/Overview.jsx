import React from 'react'
import InfoCard from '../components/InfoCard'
import { UsersIcon, CubeIcon } from '@heroicons/react/outline'

const Overview = ({ info }) => {
	return (
		<div className='mb-2'>
			<p className='mb-2 font-medium text-gray-500'>
				Overview <span className='text-xs text-gray-400'>(Last 30 Days)</span>
			</p>

			<div className='-mr-4 flex flex-wrap'>
				<InfoCard
					info={info.totalUsers}
					icon={
						<UsersIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
					}
					text='Total User'
					increment={info.newUsers === 0 ? false : info.newUsers}
					haveLetterS={true}
				/>

				{info.pendingUsers !== 0 && (
					<InfoCard
						info={info.pendingUsers}
						icon={
							<UsersIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
						}
						text='Pending Approval'
					/>
				)}

				<InfoCard
					info={info.totalChemicals}
					icon={
						<CubeIcon className='h-14 w-14 rounded-full bg-indigo-50 p-3 text-indigo-500' />
					}
					text='Total Chemical'
					increment={info.newChemicals === 0 ? false : info.newChemicals}
					haveLetterS={true}
				/>

				{info.lowAmountChemicals !== 0 && (
					<InfoCard
						info={info.lowAmountChemicals}
						icon={
							<CubeIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
						}
						text='Low Amount'
					/>
				)}

				{info.expiringChemicals !== 0 && (
					<InfoCard
						info={info.expiringChemicals}
						icon={
							<CubeIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
						}
						text='Expiring Soon'
					/>
				)}

				{info.expiredChemicals !== 0 && (
					<InfoCard
						info={info.expiredChemicals}
						icon={
							<CubeIcon className='h-14 w-14 rounded-full bg-red-50 p-3 text-red-500' />
						}
						text='Expired'
					/>
				)}

				{info.disposedChemicals !== 0 && (
					<InfoCard
						info={info.disposedChemicals}
						icon={
							<CubeIcon className='h-14 w-14 rounded-full bg-red-50 p-3 text-red-500' />
						}
						text='Disposed'
					/>
				)}
			</div>
		</div>
	)
}

export default Overview
