import React, { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { MOBILE_MENU_LIST } from '../../../config/menu_list'
import ScanQRCodeModal from '../../app/components/ScanQRCodeModal'

const MobileMenu = () => {
	const { auth } = useAuth()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const [openModal, setOpenModal] = useState(false)

	const menuHandler = (link) => {
		window.scrollTo(0, 0)
		if (link === '-') {
			setOpenModal(true)
		} else {
			navigate(link)
		}
	}

	return (
		<>
			<nav className='fixed left-0 right-0 bottom-0 z-10 w-full border-t border-gray-200 bg-white px-4 pt-2.5 shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)]'>
				<div className='flex items-center justify-between space-x-4 overflow-y-auto pb-2.5'>
					{MOBILE_MENU_LIST.map((menu, index) =>
						auth.currentRole >= menu.minRole &&
						menu.text !== 'Profile' &&
						menu.text !== 'My Labs' ? (
							<div
								key={index}
								className={`flex flex-1 flex-col items-center space-y-1 text-center ${
									pathname === menu.link ? 'pointer-events-none' : ''
								}`}
								onClick={() => menuHandler(menu.link)}
							>
								<div
									className={`h-6 w-6 ${
										pathname === menu.link ? 'text-indigo-600' : 'text-gray-400'
									}`}
								>
									{menu.icon}
								</div>
								<p
									className={`whitespace-nowrap text-xs ${
										pathname === menu.link
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

			{openModal && (
				<ScanQRCodeModal openModal={openModal} setOpenModal={setOpenModal} />
			)}
		</>
	)
}

export default MobileMenu
