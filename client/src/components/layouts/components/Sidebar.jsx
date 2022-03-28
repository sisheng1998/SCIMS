import React from 'react'
import { NavLink } from 'react-router-dom'
import MENU_LIST, { ADMIN_MENU_LIST } from '../../../config/menu_list'
import ROLES_LIST from '../../../config/roles_list'
import useAuth from '../../../hooks/useAuth'

const Sidebar = () => {
	const { auth } = useAuth()

	const menus =
		auth.currentLabId === ROLES_LIST.admin.toString()
			? ADMIN_MENU_LIST
			: MENU_LIST

	return (
		<nav
			id='sidebar'
			className='group fixed left-0 top-0 bottom-0 z-[8] flex w-max flex-col border-r border-gray-300 bg-white pb-4 pt-[calc(71px+16px)] shadow-md hover:shadow-lg'
		>
			{menus.map((menu, index) =>
				auth.currentRole >= menu.minRole ? (
					<NavLink
						className='flex items-center py-1 px-[1.125rem] font-medium text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 xl:px-3'
						key={index}
						to={menu.link}
						end
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
