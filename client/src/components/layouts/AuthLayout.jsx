import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = ({ children }) => {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-6'>
			<img
				className='mx-auto h-12'
				src='/scims-logo.svg'
				alt='SCIMS Logo'
				draggable='false'
			/>
			{children ? children : <Outlet />}
		</div>
	)
}

export default AuthLayout
