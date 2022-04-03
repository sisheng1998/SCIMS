import React, { useState } from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import { Combobox } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'

const Search = ({ chemicals, searchRef }) => {
	const navigate = useNavigate()
	const [query, setQuery] = useState('')

	const filteredChemicals = query
		? chemicals.filter(
				(chemical) =>
					chemical.name.toLowerCase().includes(query.toLowerCase()) ||
					chemical.CAS.toLowerCase().includes(query.toLowerCase())
		  )
		: []

	return (
		<Combobox
			onChange={(chemical) => {
				searchRef.current.value = ''
				setQuery('')
				navigate(`/inventory/${chemical._id}`)
			}}
			as='div'
			className='relative w-full max-w-sm'
		>
			<div className='flex items-center rounded-lg hover:shadow-sm'>
				<Combobox.Input
					type='text'
					placeholder='Search inventory'
					className='w-full pr-8 pl-7 text-sm shadow-none'
					onChange={(e) => setQuery(e.target.value)}
					ref={searchRef}
				/>
				<SearchIcon className='absolute left-2 h-4 w-4 cursor-pointer text-gray-400 transition hover:text-indigo-600' />
			</div>

			<Combobox.Options
				className={`absolute top-full mt-2 max-h-80 w-full overflow-y-auto rounded-lg bg-white py-2 text-sm font-semibold leading-6 shadow-md outline-gray-300 ring-1 ring-gray-300 ${
					!query && filteredChemicals.length === 0 ? 'hidden' : ''
				}`}
			>
				{filteredChemicals.map((chemical) => (
					<Combobox.Option key={chemical._id} value={chemical}>
						{({ active }) => (
							<p
								className={`cursor-pointer py-0.5 px-3 ${
									active ? 'bg-indigo-600 text-white' : ''
								}`}
							>
								{chemical.name}
								<span
									className={`text-sx ml-2 font-normal ${
										active ? 'text-indigo-100' : 'text-gray-500'
									}`}
								>
									{chemical.CAS}
								</span>
							</p>
						)}
					</Combobox.Option>
				))}

				{query && filteredChemicals.length === 0 && (
					<p className='py-0.5 px-3 font-normal'>No result found.</p>
				)}
			</Combobox.Options>
		</Combobox>
	)
}

export default Search
