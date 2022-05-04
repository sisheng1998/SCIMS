import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { MOBILE_MENU_LIST } from '../../../config/menu_list'

const MobileMenu = () => {
	const { auth } = useAuth()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const menuHandler = (link) => {
		window.scrollTo(0, 0)
		navigate(link)
	}

	return (
		<nav className='fixed left-0 right-0 bottom-0 z-10 w-full border-t border-gray-200 bg-white px-4 pt-2.5 shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)]'>
			<div className='flex items-center justify-between space-x-4 overflow-y-auto pb-2 pt-1'>
				{MOBILE_MENU_LIST.map((menu, index) =>
					auth.currentRole >= menu.minRole ? (
						<div
							key={index}
							className='flex flex-1 flex-col items-center space-y-0.5 text-center'
							onClick={() => menuHandler(menu.link)}
						>
							<div
								className={`relative h-6 w-6 ${
									pathname.includes(menu.link) && menu.text !== 'Home'
										? 'text-indigo-600'
										: 'text-gray-400'
								}`}
							>
								{menu.icon}
								{menu.text === 'Notifications' && auth.notification && (
									<span className='absolute top-0 right-0 inline-block h-1.5 w-1.5 rounded-full bg-indigo-600'></span>
								)}
							</div>
							<p
								className={`whitespace-nowrap text-xs text-[0.625rem] ${
									pathname.includes(menu.link) && menu.text !== 'Home'
										? 'font-semibold text-indigo-600'
										: 'font-medium'
								}`}
							>
								{menu.text}
							</p>
						</div>
					) : null
				)}
			</div>
		</nav>
	)
}

export default MobileMenu
