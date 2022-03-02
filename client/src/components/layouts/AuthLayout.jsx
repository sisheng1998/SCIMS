import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-6 xl:p-4'>
			<img
				className='mx-auto h-12'
				src='/scims-logo.svg'
				alt='SCIMS Logo'
				draggable='false'
			/>
			<Outlet />
		</main>
	)
}

export default AuthLayout
