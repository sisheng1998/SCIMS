import React, { Fragment, useEffect, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'

const LabSelection = () => {
	const { auth, setAuth } = useAuth()

	const index = auth.roles.findIndex((role) => {
		return role.lab.labName === auth.currentLab
	})

	const [selected, setSelected] = useState(auth.roles[index])

	useEffect(() => {
		setAuth((prev) => {
			return {
				...prev,
				currentLab: selected.lab.labName,
				currentRole: selected.role,
			}
		})
	}, [selected, setAuth])

	return (
		<Listbox
			as='div'
			className='relative'
			value={selected}
			onChange={setSelected}
		>
			<Listbox.Button className='flex items-center rounded-full bg-gray-100 py-1 px-3 text-sm font-medium text-gray-500 outline-gray-300 hover:bg-gray-200'>
				{selected.lab.labName}
				<svg width='6' height='3' className='ml-2 overflow-visible'>
					<path
						d='M0 0L3 3L6 0'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.5'
						strokeLinecap='round'
					></path>
				</svg>
			</Listbox.Button>

			<Listbox.Options className='absolute top-full mt-1 w-36 rounded-lg bg-white py-2 text-sm font-medium leading-6 shadow outline-gray-300 ring-1 ring-gray-300'>
				{auth.roles.map((role) =>
					role.isActive ? (
						<Listbox.Option key={role._id} value={role} as={Fragment}>
							{({ selected }) => (
								<li
									className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-gray-100 ${
										selected && 'pointer-events-none text-indigo-600'
									}`}
								>
									{role.lab.labName}
									{selected && <CheckIcon className='ml-2 h-4 w-4' />}
								</li>
							)}
						</Listbox.Option>
					) : null
				)}
			</Listbox.Options>
		</Listbox>
	)
}

export default LabSelection
