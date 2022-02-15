import React from 'react'
import { NavLink } from 'react-router-dom'
import MENU_LIST from './MENU_LIST'

const Sidebar = () => {
	return (
		<nav
			id='sidebar'
			className='group fixed left-0 top-0 bottom-0 flex w-max flex-col border-r border-gray-300 bg-white p-4 pt-[calc(71px+16px)] shadow-md hover:shadow-lg'
		>
			{MENU_LIST.map((menu, index) => (
				<NavLink
					className='my-1 flex items-center font-medium text-gray-500 hover:text-gray-900'
					key={index}
					to={menu.link}
				>
					{menu.icon}

					<span className='ml-2 mr-4 hidden group-hover:inline'>
						{menu.text}
					</span>
				</NavLink>
			))}
		</nav>
	)
}

export default Sidebar
