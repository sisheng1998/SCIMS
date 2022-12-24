import React from 'react'
import { Menu } from '@headlessui/react'
import {
  UserIcon,
  ColorSwatchIcon,
  LogoutIcon,
  SupportIcon,
} from '@heroicons/react/outline'
import useLogout from '../../../hooks/useLogout'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import GetRoleName from '../../utils/GetRoleName'
import GetLetterPicture from '../../utils/GetLetterPicture'

const USER_MENU = ['Profile', 'My Labs', 'Support', 'Logout']
const PATH = ['/profile', '/labs', '/support']

const UserOption = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { auth } = useAuth()
  const logout = useLogout()

  const menuHandler = (index) => {
    if (index === 3) {
      logout()
    } else {
      navigate(PATH[index])
    }
  }

  const imageSrc = auth.avatar
    ? auth.avatarPath + auth.avatar
    : GetLetterPicture(auth.name)

  return (
    <Menu as='div' className='relative flex items-center'>
      <Menu.Button className='outline-gray-300'>
        <img
          src={imageSrc}
          onError={(event) => (event.target.src = GetLetterPicture(auth.name))}
          alt='Avatar'
          className='h-9 w-9 rounded-full object-cover'
          height='64'
          width='64'
          draggable={false}
        />
      </Menu.Button>

      <Menu.Items className='absolute right-0 top-full mt-2 w-auto min-w-[200px] rounded-lg bg-white py-2 shadow-md outline-gray-300 ring-1 ring-gray-300'>
        <div className='mb-2 border-b pl-3 pr-6 pt-1 pb-3'>
          <p className='font-medium capitalize'>
            {auth.isAdmin ? 'Admin' : GetRoleName(auth.currentRole)}
          </p>
          <p className='text-sm text-gray-500'>{auth.email}</p>
        </div>

        {USER_MENU.map((menu, index) => (
          <React.Fragment key={index}>
            {(index === 2 || index === 3) && <hr className='my-2' />}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => menuHandler(index)}
                  className={`group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 ${
                    index === 3 ? '' : 'hover:bg-indigo-50'
                  } ${active ? 'text-indigo-600' : ''} ${
                    PATH[index] === pathname
                      ? 'pointer-events-none text-indigo-600'
                      : ''
                  }`}
                >
                  {index === 0 && (
                    <UserIcon
                      className={`mr-2 h-5 w-5 group-hover:text-indigo-600 ${
                        PATH[index] === pathname
                          ? 'text-indigo-600'
                          : 'text-gray-500'
                      }`}
                    />
                  )}
                  {index === 1 && (
                    <ColorSwatchIcon
                      className={`mr-2 h-5 w-5 group-hover:text-indigo-600 ${
                        PATH[index] === pathname
                          ? 'text-indigo-600'
                          : 'text-gray-500'
                      }`}
                    />
                  )}
                  {index === 2 && (
                    <SupportIcon
                      className={`mr-2 h-5 w-5 group-hover:text-indigo-600 ${
                        PATH[index] === pathname
                          ? 'text-indigo-600'
                          : 'text-gray-500'
                      }`}
                    />
                  )}
                  {index === 3 && (
                    <LogoutIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
                  )}
                  {menu}
                </button>
              )}
            </Menu.Item>
          </React.Fragment>
        ))}
      </Menu.Items>
    </Menu>
  )
}

export default UserOption
