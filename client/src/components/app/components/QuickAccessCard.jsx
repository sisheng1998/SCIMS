import React from 'react'
import useAuth from '../../../hooks/useAuth'
import MENU_LIST, { ADMIN_MENU_LIST } from '../../../config/menu_list'
import ROLES_LIST from '../../../config/roles_list'
import { useNavigate } from 'react-router-dom'
import { UserIcon, ColorSwatchIcon } from '@heroicons/react/outline'

const QuickAccessCard = () => {
	const { auth } = useAuth()
	const navigate = useNavigate()

	const menus =
		auth.currentLabId === ROLES_LIST.admin.toString()
			? ADMIN_MENU_LIST
			: MENU_LIST

	const cardClasses =
		'group flex cursor-pointer flex-col items-center space-y-2 text-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:border-indigo-600 hover:bg-indigo-50 hover:shadow'

	return (
		<>
			<p className='mb-2 text-lg font-medium text-gray-500'>Quick Access</p>

			<div className='grid grid-cols-7 gap-6 2xl:grid-cols-5 xl:grid-cols-4 xl:gap-4 lg:grid-cols-2'>
				{menus.map((menu, index) =>
					auth.currentRole >= menu.minRole && menu.text !== 'Dashboard' ? (
						<div
							key={index}
							className={cardClasses}
							onClick={() => navigate(menu.link)}
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

				<div className={cardClasses} onClick={() => navigate('/profile')}>
					<div className='h-8 w-8 text-gray-400 transition group-hover:text-indigo-600'>
						<UserIcon />
					</div>
					<p className='font-medium transition group-hover:text-indigo-600'>
						Profile
					</p>
				</div>

				<div className={cardClasses} onClick={() => navigate('/labs')}>
					<div className='h-8 w-8 text-gray-400 transition group-hover:text-indigo-600'>
						<ColorSwatchIcon />
					</div>
					<p className='font-medium transition group-hover:text-indigo-600'>
						My Labs
					</p>
				</div>
			</div>
		</>
	)
}

export default QuickAccessCard
