import React, { useCallback, useState, useEffect } from 'react'
import ROLES_LIST from '../../../config/roles_list'
import useAuth from '../../../hooks/useAuth'
import {
	SelectorIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from '@heroicons/react/outline'
import Pagination from './Pagination'

const sortData = ({ tableData, sortKey, reverse }) => {
	if (!sortKey) return tableData

	const sortedData = tableData.sort((a, b) => {
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
			}),
		[props.data, sortKey, sortOrder]
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
	const [itemsPerPage, setItemsPerPage] = useState(5)
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	return (
		<>
			<div className='mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-1 shadow'>
				<div className='overflow-x-auto'>
					<div className='inline-block min-w-full border-b border-gray-200'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									{tableHeaders.map((header) => (
										<th
											key={header.key}
											scope='col'
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
									if (!user.isEmailVerified) return null

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
													<button className='flex font-medium text-indigo-600 transition hover:text-indigo-700'>
														Edit
													</button>
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
				itemsPerPage={itemsPerPage}
				totalItems={props.data.length}
				paginate={paginate}
			/>
		</>
	)
}

export default UsersTable
