import React from 'react'
import { Menu } from '@headlessui/react'
import { UserCircleIcon, UserIcon, LogoutIcon } from '@heroicons/react/outline'
import useLogout from '../../../hooks/useLogout'
import { useNavigate } from 'react-router-dom'

const USER_MENU = ['Profile', 'Logout']

const UserOption = () => {
	const logout = useLogout()
	const navigate = useNavigate()

	const menuHandler = (index) => {
		if (index === 0) {
			navigate('/profile')
		} else if (index === 1) {
			logout()
		}
	}

	return (
		<Menu as='div' className='relative flex items-center'>
			<Menu.Button className='text-gray-500 outline-gray-300 transition hover:text-indigo-600'>
				<UserCircleIcon className='h-8 w-8 stroke-1' />
			</Menu.Button>

			<Menu.Items className='absolute right-0 top-full mt-2 w-32 rounded-lg bg-white py-2 shadow-md outline-gray-300 ring-1 ring-gray-300'>
				{USER_MENU.map((menu, index) => (
					<Menu.Item key={index}>
						{({ active }) => (
							<button
								onClick={() => menuHandler(index)}
								className={`group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-indigo-50 ${
									active ? 'text-indigo-600' : ''
								}`}
							>
								{index === 0 && (
									<UserIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
								)}
								{index === 1 && (
									<LogoutIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
								)}
								{menu}
							</button>
						)}
					</Menu.Item>
				))}
			</Menu.Items>
		</Menu>
	)
}

export default UserOption