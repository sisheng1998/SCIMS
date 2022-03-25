import React, { useState, useCallback } from 'react'
import { Listbox } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/outline'

const FilterOptions = ({ options, searchTerm, searchCols }) => {
	const filteredOptions = options
		.filter((option) =>
			searchCols.some(
				(col) =>
					option[col]
						.toString()
						.toLowerCase()
						.indexOf(searchTerm.toLowerCase()) > -1
			)
		)
		.sort((a, b) => (a[searchCols[0]] > b[searchCols[0]] ? 1 : -1))

	return filteredOptions
}

const UserSearchableSelect = ({
	readOnly,
	selectedId,
	setSelectedId,
	options,
}) => {
	const selectedOption = options.find((options) => options._id === selectedId)
	const [searchTerm, setSearchTerm] = useState('')

	const filterOptions = useCallback(
		() =>
			FilterOptions({
				options,
				searchTerm,
				searchCols: ['name', 'email'],
			}),
		[options, searchTerm]
	)

	const filteredOptions = filterOptions()

	return (
		<div className='relative'>
			<Listbox value={selectedId} onChange={setSelectedId}>
				<Listbox.Button
					className={`flex w-full items-center justify-between rounded-lg border border-gray-300 p-2 pl-3 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
						readOnly ? 'read-only pointer-events-none' : ''
					}`}
				>
					{selectedId ? (
						<span>
							{selectedOption.name}
							<span className='ml-2 text-sm text-gray-500'>
								{selectedOption.email}
							</span>
						</span>
					) : (
						<span className='text-gray-400'>Select user</span>
					)}
					{readOnly ? null : <SelectorIcon className='h-6 w-6 text-gray-500' />}
				</Listbox.Button>

				<Listbox.Options
					onKeyDownCapture={(e) => {
						e.stopPropagation()
						e.currentTarget.scrollTop = 0
					}}
					className='absolute z-10 mt-1 max-h-[11.5rem] w-full overflow-auto rounded-lg border border-gray-300 bg-white pb-1 shadow-lg focus:outline-none'
				>
					<div className='sticky top-0 mb-1 border-b bg-white'>
						<input
							type='text'
							name='searchUserOption'
							id='searchUserOption'
							placeholder='Search name or email'
							spellCheck='false'
							autoComplete='off'
							className='w-full border-0 text-sm shadow-none focus:ring-0'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className='peer'>
						{filteredOptions.map((option) => (
							<Listbox.Option
								key={option._id}
								value={option._id}
								className='focus-visible:outline-none'
							>
								{({ selected, active }) => (
									<p
										className={`flex cursor-pointer items-center justify-between px-3 py-0.5 ${
											active ? 'bg-indigo-600 text-white' : ''
										}`}
									>
										<span className={selected ? 'font-medium' : ''}>
											{option.name}
											<span
												className={`ml-2 text-sm text-gray-500 ${
													active ? 'text-indigo-100' : ''
												}`}
											>
												{option.email}
											</span>
										</span>

										{selected && (
											<CheckIcon
												className={`h-6 w-6 stroke-2 text-indigo-600 ${
													active ? 'text-white' : ''
												}`}
											/>
										)}
									</p>
								)}
							</Listbox.Option>
						))}
					</div>
					<p className='hidden px-3 py-0.5 text-gray-500 peer-empty:block'>
						No result found.
					</p>
				</Listbox.Options>
			</Listbox>
		</div>
	)
}

export default UserSearchableSelect

const LabSearchableSelect = ({
	selectedId,
	setSelectedId,
	options,
	validated,
	checkExist,
	userRoles,
}) => {
	const selectedOption = options.find((options) => options._id === selectedId)
	const [searchTerm, setSearchTerm] = useState('')

	const filterOptions = useCallback(
		() =>
			FilterOptions({
				options,
				searchTerm,
				searchCols: ['labName'],
			}),
		[options, searchTerm]
	)

	const filteredOptions = filterOptions()

	return (
		<div className='relative'>
			<Listbox value={selectedId} onChange={setSelectedId}>
				<Listbox.Button
					className={`flex w-full items-center justify-between rounded-lg border border-gray-300 p-2 pl-3 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
						validated ? 'input-valid' : ''
					}`}
				>
					{selectedId ? (
						'Lab ' + selectedOption.labName
					) : (
						<span className='text-gray-400'>Select lab</span>
					)}
					<SelectorIcon className='h-6 w-6 text-gray-500' />
				</Listbox.Button>

				<Listbox.Options
					onKeyDownCapture={(e) => {
						e.stopPropagation()
						e.currentTarget.scrollTop = 0
					}}
					className='absolute z-10 mt-1 max-h-[11.5rem] w-full overflow-auto rounded-lg border border-gray-300 bg-white pb-1 shadow-lg focus:outline-none'
				>
					<div className='sticky top-0 mb-1 border-b bg-white'>
						<input
							type='text'
							name='searchLabOption'
							id='searchLabOption'
							placeholder='Search lab'
							spellCheck='false'
							autoComplete='off'
							className='w-full border-0 text-sm shadow-none focus:ring-0'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className='peer'>
						{filteredOptions.map((option) => {
							const existed =
								checkExist &&
								userRoles.some((role) => role.lab._id === option._id)

							return existed ? null : (
								<Listbox.Option
									key={option._id}
									value={option._id}
									className='focus-visible:outline-none'
								>
									{({ selected, active }) => (
										<p
											className={`flex cursor-pointer items-center justify-between px-3 py-0.5 ${
												active ? 'bg-indigo-600 text-white' : ''
											}`}
										>
											<span className={selected ? 'font-medium' : ''}>
												{'Lab ' + option.labName}
											</span>

											{selected && (
												<CheckIcon
													className={`h-6 w-6 stroke-2 text-indigo-600 ${
														active ? 'text-white' : ''
													}`}
												/>
											)}
										</p>
									)}
								</Listbox.Option>
							)
						})}
					</div>

					<p className='hidden px-3 py-0.5 text-gray-500 peer-empty:block'>
						No result found.
					</p>
				</Listbox.Options>
			</Listbox>
		</div>
	)
}

export { LabSearchableSelect }
