import React from 'react'
import { NavLink } from 'react-router-dom'
import MENU_LIST from '../../../config/menu_list'
import useAuth from '../../../hooks/useAuth'

const Sidebar = () => {
	const { auth } = useAuth()

	return (
		<nav
			id='sidebar'
			className='group fixed left-0 top-0 bottom-0 flex w-max flex-col border-r border-gray-300 bg-white pb-4 pt-[calc(71px+16px)] shadow-md hover:shadow-lg'
		>
			{MENU_LIST.map((menu, index) =>
				auth.currentRole >= menu.minRole ? (
					<NavLink
						className='flex items-center py-1 px-4 font-medium text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
						key={index}
						to={menu.link}
					>
						{menu.icon}

						<span className='ml-2 mr-4 hidden group-hover:block'>
							{menu.text}
						</span>
					</NavLink>
				) : null
			)}
		</nav>
	)
}

export default Sidebar