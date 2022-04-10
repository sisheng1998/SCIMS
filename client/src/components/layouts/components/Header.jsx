import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../../images/scims-logo.svg'
import LabSelection from './LabSelection'
import Search from './Search'
import Notification from './Notification'
import UserOption from './UserOption'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'

const Header = () => {
	const searchRef = useRef()
	const { auth } = useAuth()
	const isAdmin = auth.currentLabId === ROLES_LIST.admin.toString()

	return (
		<header className='fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-gray-300 bg-white py-4 px-6 shadow-sm xl:px-4'>
			<div className='mr-6 flex items-center'>
				<Link className='mr-4' to={isAdmin ? '/admin' : '/'}>
					<img src={Logo} alt='SCIMS Logo' className='h-8' draggable={false} />
				</Link>

				<LabSelection searchRef={searchRef} />
			</div>

			<div className='flex flex-1 items-center justify-end'>
				{!isAdmin && <Search searchRef={searchRef} />}
				<Notification />
				<UserOption />
			</div>
		</header>
	)
}

export default Header
