import React from 'react'
import { BellIcon } from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

const Notification = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	return (
		<button
			onClick={() => navigate('/notifications')}
			className='relative mr-3 rounded-lg border border-gray-300 p-2 text-gray-500 outline-gray-300 transition hover:text-indigo-600'
		>
			<BellIcon className='h-5 w-5' />
			{auth.notification && (
				<span className='absolute top-1.5 right-1.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-600'></span>
			)}
		</button>
	)
}

export default Notification
