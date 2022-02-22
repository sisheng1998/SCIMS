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

const SearchableSelect = ({ selectedId, setSelectedId, options }) => {
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
				<Listbox.Button className='flex w-full items-center justify-between rounded-lg border border-gray-300 p-2 pl-3 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'>
					{selectedId ? (
						<span>
							{selectedOption.name}
							<span className='ml-2 text-sm text-gray-500'>
								{selectedOption.email}
							</span>
						</span>
					) : (
						'Select user'
					)}
					<SelectorIcon className='h-6 w-6 text-gray-500' />
				</Listbox.Button>

				<Listbox.Options
					onKeyDownCapture={(e) => {
						e.stopPropagation()
						e.currentTarget.scrollTop = 0
					}}
					className='absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-gray-300 bg-white pb-1 shadow-lg focus:outline-none'
				>
					<div className='sticky top-0 mb-1 border-b bg-white'>
						<input
							type='text'
							name='searchOption'
							id='searchOption'
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
													active ? 'text-white' : ''
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
					<p className='hidden px-3 py-0.5 peer-empty:block'>
						No result found.
					</p>
				</Listbox.Options>
			</Listbox>
		</div>
	)
}

export default SearchableSelect
