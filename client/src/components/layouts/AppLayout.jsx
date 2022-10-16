import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import MobileMenu from './components/MobileMenu'
import useMobile from '../../hooks/useMobile'
import ScrollToTop from './components/ScrollToTop'

const AppLayout = () => {
  const isMobile = useMobile()

  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <Header />
        {!isMobile && <Sidebar />}
        <main className='flex flex-1 flex-col p-6 pt-[calc(72px+24px)] pl-[calc(73px+24px)] xl:pr-4 xl:pl-[calc(61px+16px)] xl:pt-[calc(72px+16px)] lg:pl-4 lg:pt-[calc(62px+16px)] lg:pb-[calc(48px+16px)]'>
          <Outlet />
        </main>
        {isMobile ? <MobileMenu /> : <Footer />}
      </div>

      {isMobile && <ScrollToTop />}
    </>
  )
}

export default AppLayout
