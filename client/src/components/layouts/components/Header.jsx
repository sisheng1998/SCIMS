import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../../images/scims-logo.svg'
import LabSelection from './LabSelection'
import Search from './Search'
import Notification from './Notification'
import UserOption from './UserOption'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import useMobile from '../../../hooks/useMobile'

const Header = () => {
	const searchRef = useRef()
	const { auth } = useAuth()
	const isMobile = useMobile()

	const isAdmin = !isMobile && auth.currentLabId === ROLES_LIST.admin.toString()

	return (
		<header className='fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-t border-gray-300 !border-t-gray-100 bg-white py-4 px-6 shadow-sm xl:px-4 lg:border-gray-200 lg:py-3'>
			<div className='mr-6 flex items-center'>
				<Link className='mr-4' to={isAdmin ? '/admin' : '/'}>
					<img
						src={Logo}
						alt='SCIMS Logo'
						className={isMobile ? 'h-6' : 'h-8'}
						draggable={false}
					/>
				</Link>

				<LabSelection searchRef={searchRef} />
			</div>

			<div className='flex flex-1 items-center justify-end'>
				{!isMobile && <Search searchRef={searchRef} isAdmin={isAdmin} />}
				{!isMobile && <Notification />}
				<UserOption />
			</div>
		</header>
	)
}

export default Header
