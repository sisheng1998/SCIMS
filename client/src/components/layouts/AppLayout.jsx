import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

const AppLayout = () => {
	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<Sidebar />
			<main className='flex flex-col p-4 pt-[calc(71px+16px)] pl-[calc(69px+16px)]'>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default AppLayout
