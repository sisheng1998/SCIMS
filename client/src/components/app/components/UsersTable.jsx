import React, { useCallback, useState, useEffect } from 'react'
import ROLES_LIST from '../../../config/roles_list'
import useAuth from '../../../hooks/useAuth'
import {
	SelectorIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from '@heroicons/react/outline'
import Pagination from './Pagination'

const sortData = ({ tableData, sortKey, reverse, searchTerm }) => {
	if (!sortKey) return tableData

	const sortedData = tableData
		.filter(
			(data) =>
				data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				data.email.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			return a[sortKey] > b[sortKey] ? 1 : -1
		})

	if (reverse) {
		return sortedData.reverse()
	}

	return sortedData
}

const SortButton = ({ children, sortOrder, columnKey, sortKey, onClick }) => {
	return (
		<button
			className='group flex items-center font-medium transition hover:text-indigo-600'
			onClick={onClick}
		>
			{children}
			{sortKey === columnKey ? (
				sortOrder === 'asc' ? (
					<ChevronUpIcon className='ml-1 h-4 w-4 stroke-2 p-0.5 text-gray-400 transition group-hover:text-indigo-500' />
				) : (
					<ChevronDownIcon className='ml-1 h-4 w-4 stroke-2 p-0.5 text-gray-400 transition group-hover:text-indigo-500' />
				)
			) : (
				<SelectorIcon className='ml-1 h-4 w-4 text-gray-400 transition group-hover:text-indigo-500' />
			)}
		</button>
	)
}

const UsersTable = (props) => {
	const { auth } = useAuth()

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		setSortKey('index')
		setSortOrder('asc')
	}, [auth])

	const tableHeaders = [
		{
			key: 'name',
			label: 'Name',
			sortable: true,
		},
		{
			key: 'email',
			label: 'Email Address',
			sortable: true,
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
		},
		{
			key: 'role',
			label: 'Role',
			sortable: true,
		},
		{
			key: 'action',
			label: 'Action',
			sortable: false,
		},
	]

	const sortedData = useCallback(
		() =>
			sortData({
				tableData: props.data,
				sortKey,
				reverse: sortOrder === 'desc',
				searchTerm,
			}),
		[props.data, sortKey, sortOrder, searchTerm]
	)

	const changeSortOrder = (key) => {
		if (key === sortKey) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')

			if (sortOrder === 'desc') {
				return setSortKey('index')
			}
		}
		setSortKey(key)
	}

	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)

	let indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const data = sortedData()

	if (indexOfLastItem > data.length) {
		indexOfLastItem = data.length
	}

	const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	useEffect(() => {
		setCurrentPage(1)
	}, [itemsPerPage, searchTerm])

	return (
		<>
			<div className='mb-4 flex items-end justify-between text-sm text-gray-500'>
				<div className='flex items-center'>
					<p>Display</p>
					<select
						className='mx-2 p-1 pl-2 pr-8 text-sm'
						name='itemsPerPage'
						id='itemsPerPage'
						value={itemsPerPage === data.length ? 'All' : itemsPerPage}
						onChange={(e) => {
							const value = e.target.value

							if (value === 'All') {
								setItemsPerPage(data.length)
							} else {
								setItemsPerPage(value)
							}
						}}
					>
						<option value='10'>10</option>
						<option value='50'>50</option>
						<option value='100'>100</option>
						<option value='All'>All</option>
					</select>
					<p>records</p>
				</div>

				<div className='flex items-center'>
					<p>Search</p>
					<input
						type='text'
						id='search'
						className='ml-2 px-2 py-1 text-sm'
						autoComplete='off'
						spellCheck='false'
						placeholder='Name / Email'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className='mb-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
				<div className='overflow-x-auto'>
					<div className='border-b border-gray-200'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									{tableHeaders.map((header) => (
										<th
											scope='col'
											key={header.key}
											className='px-6 py-3 text-left font-medium text-gray-500'
										>
											{header.sortable ? (
												<SortButton
													columnKey={header.key}
													onClick={() => changeSortOrder(header.key)}
													{...{ sortOrder, sortKey }}
												>
													{header.label}
												</SortButton>
											) : (
												header.label
											)}
										</th>
									))}
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-200 bg-white'>
								{currentItems.map((user) => {
									let classes

									if (user.status === 'Active') {
										classes = 'bg-green-100 text-green-600'
									} else if (user.status === 'Pending') {
										classes = 'bg-yellow-100 text-yellow-600'
									} else {
										// Deactivated
										classes = 'bg-red-100 text-red-600'
									}

									return (
										<tr key={user._id}>
											<td className='px-6 py-4'>{user.name}</td>
											<td className='px-6 py-4'>{user.email}</td>
											<td className='px-6 py-4'>
												<span
													className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
												>
													{user.status}
												</span>
											</td>
											<td className='px-6 py-4 capitalize'>{user.role}</td>
											<td className='px-6 py-4 text-center'>
												{auth.currentRole >= ROLES_LIST.labOwner ? (
													auth.email === user.email ? (
														<button className='flex font-medium text-indigo-600 transition hover:text-indigo-700'>
															View
														</button>
													) : (
														<button className='flex font-medium text-indigo-600 transition hover:text-indigo-700'>
															Edit
														</button>
													)
												) : (
													<button className='flex font-medium text-indigo-600 transition hover:text-indigo-700'>
														View
													</button>
												)}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<Pagination
				searchTerm={searchTerm}
				indexOfFirstItem={indexOfFirstItem}
				indexOfLastItem={indexOfLastItem}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={data.length}
				paginate={paginate}
			/>
		</>
	)
}

export default UsersTable
