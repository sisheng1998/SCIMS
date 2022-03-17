import React from 'react'
import { Menu } from '@headlessui/react'
import {
	UserCircleIcon,
	UserIcon,
	BeakerIcon,
	LogoutIcon,
} from '@heroicons/react/outline'
import useLogout from '../../../hooks/useLogout'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import GetRoleName from '../../utils/GetRoleName'

const USER_MENU = ['Profile', 'My Labs', 'Logout']

const UserOption = () => {
	const logout = useLogout()
	const navigate = useNavigate()
	const { auth } = useAuth()

	const menuHandler = (index) => {
		if (index === 0) {
			navigate('/profile')
		} else if (index === 1) {
			navigate('/labs')
		} else if (index === 2) {
			logout()
		}
	}

	return (
		<Menu as='div' className='relative flex items-center'>
			<Menu.Button className='outline-gray-300'>
				{auth.avatar ? (
					<img
						src={auth.avatar}
						alt='Avatar'
						className='h-9 w-9 rounded-full border border-gray-300 object-cover'
						height='64'
						width='64'
						draggable={false}
					/>
				) : (
					<UserCircleIcon className='h-8 w-8 stroke-1 text-gray-500 transition hover:text-indigo-600' />
				)}
			</Menu.Button>

			<Menu.Items className='absolute right-0 top-full mt-2 w-auto rounded-lg bg-white py-2 shadow-md outline-gray-300 ring-1 ring-gray-300'>
				<div className='mb-2 border-b pl-3 pr-6 pt-1 pb-3'>
					<p className='font-medium capitalize'>
						{GetRoleName(auth.currentRole)}
					</p>
					<p className='text-sm text-gray-500'>{auth.email}</p>
				</div>

				{USER_MENU.map((menu, index) => (
					<React.Fragment key={index}>
						{index === 2 && <hr className='my-2' />}
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={() => menuHandler(index)}
									className={`group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 ${
										index === 2 ? '' : 'hover:bg-indigo-50'
									} ${active ? 'text-indigo-600' : ''}`}
								>
									{index === 0 && (
										<UserIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
									)}
									{index === 1 && (
										<BeakerIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
									)}
									{index === 2 && (
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
