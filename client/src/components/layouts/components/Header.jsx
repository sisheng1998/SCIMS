import React from 'react'
import { Link } from 'react-router-dom'
import LabSelection from './LabSelection'
import Search from './Search'
import Notification from './Notification'
import UserOption from './UserOption'

const Header = () => {
	return (
		<header className='fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-gray-300 bg-white p-4 shadow-sm'>
			<div className='mr-6 flex items-center'>
				<Link className='mr-4' to='/'>
					<img
						className='h-8'
						src='/scims-logo.svg'
						alt='SCIMS Logo'
						draggable='false'
					/>
				</Link>

				<LabSelection />
			</div>

			<div className='flex flex-1 items-center justify-end'>
				<Search />
				<div className='mx-5 h-6 border-l border-gray-300'></div>
				<Notification />
				<UserOption />
			</div>
		</header>
	)
}

export default Header
