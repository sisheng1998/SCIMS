import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const AppLayout = ({ children }) => {
	return (
		<>
			<Header />
			<div className='flex min-h-screen flex-col items-center justify-center p-6'>
				{children ? children : <Outlet />}
			</div>
		</>
	)
}

export default AppLayout
