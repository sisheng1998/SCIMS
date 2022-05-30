import React, { useState, useEffect } from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import { Combobox } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const Search = ({ searchRef }) => {
	const navigate = useNavigate()
	const { auth, setAuth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [query, setQuery] = useState('')
	const [searchable, setSearchable] = useState(false)

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setSearchable(false)

		const getChemicals = async () => {
			try {
				const { data } = await axiosPrivate.post(
					'/api/private/chemicals',
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					setAuth((prev) => {
						return {
							...prev,
							chemicals: [
								...data.data.chemicals,
								...data.data.disposedChemicals,
							],
						}
					})
					setSearchable(true)
				}
			} catch (error) {
				return
			}
		}

		getChemicals()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth.currentLabId, setAuth])

	const filteredChemicals = query
		? auth.chemicals.filter(
				(chemical) =>
					chemical.name.toLowerCase().includes(query.toLowerCase()) ||
					chemical.CASId.CASNo.toLowerCase().includes(query.toLowerCase())
		  )
		: []

	return (
		<>
			<Combobox
				onChange={(chemical) => {
					searchRef.current.value = ''
					setQuery('')
					navigate(`/inventory/${chemical._id}`)
				}}
				as='div'
				className={`relative w-full max-w-lg ${
					!searchable ? 'pointer-events-none' : ''
				}`}
			>
				<div className='flex items-center rounded-lg hover:shadow-sm'>
					<Combobox.Input
						type='text'
						placeholder='Search Inventory'
						className='w-full pl-10 text-sm shadow-none'
						onChange={(e) => setQuery(e.target.value)}
						ref={searchRef}
					/>
					<SearchIcon className='pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400' />
				</div>

				<Combobox.Options
					className={`absolute top-full mt-2 max-h-80 w-full overflow-y-auto rounded-lg bg-white py-2 text-sm font-semibold leading-6 shadow-md outline-gray-300 ring-1 ring-gray-300 ${
						!query && filteredChemicals.length === 0 ? 'hidden' : ''
					}`}
				>
					{filteredChemicals.map((chemical) => (
						<Combobox.Option key={chemical._id} value={chemical}>
							{({ active }) => {
								let classes

								if (chemical.status === 'Normal') {
									classes = 'bg-green-400'
								} else if (
									chemical.status === 'Expired' ||
									chemical.status === 'Disposed'
								) {
									classes = 'bg-red-400'
								} else {
									// Low Amount / Expiring Soon
									classes = 'bg-yellow-400'
								}

								return (
									<p
										className={`flex cursor-pointer flex-row items-center py-0.5 px-3 ${
											active ? 'bg-indigo-600 text-white' : ''
										}`}
									>
										{chemical.name}

										<span
											className={`text-sx mx-2 shrink-0 font-normal ${
												active ? 'text-indigo-100' : 'text-gray-500'
											}`}
										>
											{chemical.CASId.CASNo}
										</span>

										<span
											className={`ml-auto flex shrink-0 items-center text-xs font-medium ${
												active ? 'text-indigo-100' : 'text-gray-500'
											}`}
										>
											<span
												className={`mr-1.5 h-1.5 w-1.5 rounded-full ${classes}`}
											></span>
											{chemical.status}
										</span>
									</p>
								)
							}}
						</Combobox.Option>
					))}

					{query && filteredChemicals.length === 0 && (
						<p className='py-0.5 px-3 font-normal'>No result found.</p>
					)}
				</Combobox.Options>
			</Combobox>
			<div className='mx-5 h-6 border-l border-gray-300'></div>
		</>
	)
}

export default Search
