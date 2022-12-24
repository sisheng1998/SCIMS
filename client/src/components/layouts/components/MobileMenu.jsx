import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { MOBILE_MENU_LIST } from '../../../config/menu_list'

const MobileMenu = () => {
  const { auth } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const menuHandler = (link) => navigate(link)

  return (
    <nav className='fixed left-0 right-0 bottom-0 z-10 w-full bg-white shadow-[0_-1px_2px_0_rgba(0,0,0,0.1)]'>
      <div className='flex items-center justify-between overflow-y-auto'>
        {MOBILE_MENU_LIST.map((menu, index) =>
          auth.currentRole >= menu.minRole && menu.text !== 'Support' ? (
            <div
              key={index}
              className={`flex flex-1 flex-col items-center space-y-0.5 border-t-2 pb-3 pt-2.5 text-center ${
                pathname.includes(menu.link) && menu.text !== 'Home'
                  ? 'border-t-indigo-600'
                  : 'border-t-transparent'
              }`}
              onClick={() => menuHandler(menu.link)}
            >
              <div
                className={`relative mx-2 h-6 w-6 ${
                  pathname.includes(menu.link) && menu.text !== 'Home'
                    ? 'text-indigo-600'
                    : 'text-gray-400'
                }`}
              >
                {menu.icon}
                {menu.text === 'Notifications' && auth.notification && (
                  <span className='absolute top-0 right-0 inline-block h-1.5 w-1.5 rounded-full bg-indigo-600'></span>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>
    </nav>
  )
}

export default MobileMenu
