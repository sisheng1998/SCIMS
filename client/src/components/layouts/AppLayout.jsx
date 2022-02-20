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
			<main className='flex flex-1 flex-col p-6 pt-[calc(71px+24px)] pl-[calc(73px+24px)]'>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default AppLayout
