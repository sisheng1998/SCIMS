import React, { Fragment, useEffect, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'

const allLabs = {
	lab: { _id: ROLES_LIST.admin.toString(), labName: 'All Labs' },
	role: ROLES_LIST.admin,
}

const LabSelection = () => {
	const { auth, setAuth } = useAuth()

	// Check whether user is admin
	const isAdmin = auth.roles.some((role) => {
		return role.role === ROLES_LIST.admin && role.status === 'Active'
	})

	const currentLab = localStorage.getItem('currentLab')

	const index = auth.roles.findIndex((role) => {
		return role.lab._id === currentLab && role.lab.status === 'In Use'
	})

	const [selected, setSelected] = useState(
		isAdmin && currentLab === allLabs.lab._id ? allLabs : auth.roles[index]
	)

	useEffect(() => {
		localStorage.setItem('currentLab', selected.lab._id)
		setAuth((prev) => {
			return {
				...prev,
				currentLabId: selected.lab._id,
				currentLabName: selected.lab.labName,
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
			<Listbox.Button className='flex items-center rounded-full bg-gray-100 py-1 px-3 text-sm font-medium text-gray-500 outline-gray-300 hover:bg-gray-200 hover:text-gray-600'>
				{selected.lab.labName}
				<svg width='6' height='3' className='ml-2 overflow-visible'>
					<path
						d='M0 0L3 3L6 0'
						fill='none'
						stroke='currentColor'
						strokeWidth='1'
						strokeLinecap='round'
					></path>
				</svg>
			</Listbox.Button>

			<Listbox.Options className='absolute top-full mt-2 w-36 rounded-lg bg-white py-2 text-sm font-medium leading-6 shadow-md outline-gray-300 ring-1 ring-gray-300'>
				{isAdmin ? (
					<Listbox.Option value={allLabs} as={Fragment}>
						<li
							className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 ${
								auth.currentLabId === ROLES_LIST.admin.toString()
									? 'pointer-events-none font-semibold text-indigo-600'
									: ''
							}`}
						>
							All Labs
							{auth.currentLabId === ROLES_LIST.admin.toString() && (
								<CheckIcon className='ml-2 h-4 w-4 stroke-2' />
							)}
						</li>
					</Listbox.Option>
				) : null}

				{auth.roles.map((role) =>
					role.status === 'Active' && role.lab.status === 'In Use' ? (
						<Listbox.Option key={role._id} value={role} as={Fragment}>
							{() => (
								<li
									className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 ${
										auth.currentLabId === role.lab._id
											? 'pointer-events-none font-semibold text-indigo-600'
											: ''
									}`}
								>
									{role.lab.labName}
									{auth.currentLabId === role.lab._id && (
										<CheckIcon className='ml-2 h-4 w-4 stroke-2' />
									)}
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
