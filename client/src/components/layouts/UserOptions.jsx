import React from 'react'
import { Menu } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/outline'

const UserOptions = () => {
	return (
		<Menu as='div' className='relative flex items-center'>
			<Menu.Button>
				<UserCircleIcon className='h-8 w-8' />
			</Menu.Button>

			<Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
				<Menu.Item>
					{({ active }) => (
						<button
							className={`${
								active ? 'bg-violet-500 text-white' : 'text-gray-900'
							} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
						>
							Edit
						</button>
					)}
				</Menu.Item>
				<Menu.Item>
					{({ active }) => (
						<button
							className={`${
								active ? 'bg-violet-500 text-white' : 'text-gray-900'
							} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
						>
							Duplicate
						</button>
					)}
				</Menu.Item>
			</Menu.Items>
		</Menu>
	)
}

export default UserOptions
