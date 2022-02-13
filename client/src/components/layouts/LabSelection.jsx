import React from 'react'
import { Menu } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

const LabSelection = () => {
	return (
		<Menu as='div' className='relative'>
			<Menu.Button className='flex items-center rounded-full bg-gray-100 py-1 px-3 font-medium text-gray-500 outline-gray-300 hover:bg-gray-200'>
				Lab 3A-1
				<svg width='6' height='3' className='ml-2 overflow-visible'>
					<path
						d='M0 0L3 3L6 0'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.5'
						strokeLinecap='round'
					></path>
				</svg>
			</Menu.Button>

			<Menu.Items className='absolute top-full mt-1 w-40 rounded-lg bg-white py-2 text-sm font-medium leading-6 shadow outline-gray-300 ring-1 ring-gray-300'>
				<Menu.Item>
					{({ active }) => (
						<p className='pointer-events-none flex cursor-pointer items-center justify-between px-3 py-1 text-indigo-600 hover:bg-gray-100'>
							Lab 3A-1
							<CheckIcon className='h-4 w-4' />
						</p>
					)}
				</Menu.Item>
				<Menu.Item>
					{({ active }) => (
						<p className='flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-gray-100'>
							Lab 3A-2
						</p>
					)}
				</Menu.Item>
			</Menu.Items>
		</Menu>
	)
}

export default LabSelection
