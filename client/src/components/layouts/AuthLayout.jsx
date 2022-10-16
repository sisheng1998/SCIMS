import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../../images/scims-logo.svg'

const AuthLayout = () => {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6 xl:p-4'>
      <img
        src={Logo}
        alt='SCIMS Logo'
        className='mx-auto h-12'
        draggable={false}
      />
      <Outlet />
    </main>
  )
}

export default AuthLayout
