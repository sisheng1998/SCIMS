import React from 'react'
import { Link } from 'react-router-dom'
import LabSelection from './LabSelection'

const Header = () => {
	return (
		<header className='flex items-center border-b border-gray-300 bg-white px-6 py-4 shadow-sm'>
			<div className='flex items-center'>
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
		</header>
	)
}

export default Header
