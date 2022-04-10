import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import useMobile from '../../hooks/useMobile'

const AppLayout = () => {
	const isMobile = useMobile()

	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			{!isMobile && <Sidebar />}
			<main className='flex flex-1 flex-col p-6 pt-[calc(71px+24px)] pl-[calc(73px+24px)] xl:pr-4 xl:pl-[calc(61px+16px)] xl:pt-[calc(71px+16px)] lg:pl-4 lg:pt-[69px+16px]'>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default AppLayout
