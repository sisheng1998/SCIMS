import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../../images/Logo'

const AuthLayout = () => {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-6 xl:p-4'>
			<Logo className='mx-auto h-12' />
			<Outlet />
		</main>
	)
}

export default AuthLayout
