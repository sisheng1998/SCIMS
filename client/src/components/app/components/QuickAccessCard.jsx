import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { MOBILE_MENU_LIST } from '../../../config/menu_list'
import { useNavigate } from 'react-router-dom'

const QuickAccessCard = () => {
	const { auth } = useAuth()
	const navigate = useNavigate()

	const menuHandler = (link) => {
		window.scrollTo(0, 0)
		navigate(link)
	}

	return (
		<>
			<p className='mb-2 text-lg font-medium text-gray-500'>Quick Access</p>

			<div className='grid grid-cols-2 gap-4'>
				{MOBILE_MENU_LIST.map((menu, index) =>
					auth.currentRole >= menu.minRole &&
					menu.text !== 'Home' &&
					menu.text !== 'Scan' ? (
						<div
							key={index}
							className='group flex cursor-pointer flex-col items-center space-y-2 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:border-indigo-600 hover:bg-indigo-50 hover:shadow'
							onClick={() => menuHandler(menu.link)}
						>
							<div className='h-8 w-8 text-gray-400 transition group-hover:text-indigo-600'>
								{menu.icon}
							</div>
							<p className='font-medium transition group-hover:text-indigo-600'>
								{menu.text}
							</p>
						</div>
					) : null
				)}
			</div>
		</>
	)
}

export default QuickAccessCard
