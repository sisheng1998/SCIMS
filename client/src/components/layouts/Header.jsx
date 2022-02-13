import React from 'react'
import { Link } from 'react-router-dom'
import LabSelection from './LabSelection'

const Header = () => {
	return (
		<header className='flex items-center bg-white p-6 shadow-sm'>
			<div className='flex items-center'>
				<Link className='mr-6' to='/'>
					<img
						className='h-9'
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
