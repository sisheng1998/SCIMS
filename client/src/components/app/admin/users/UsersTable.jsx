import React, { useCallback, useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import EditUserModal from './EditUserModal'
import ViewUserModal from './ViewUserModal'
import { PencilAltIcon } from '@heroicons/react/outline'
import ROLES_LIST from '../../../../config/roles_list'

const tableHeaders = [
	{
		key: 'name',
		label: 'Full Name',
		sortable: true,
	},
	{
		key: 'email',
		label: 'Email Address',
		sortable: true,
	},
	{
		key: 'isEmailVerified',
		label: 'Status',
		sortable: true,
	},
	{
		key: 'roles',
		label: 'Labs',
		sortable: false,
	},
	{
		key: 'action',
		label: 'Action',
		sortable: false,
	},
]

const UsersTable = (props) => {
	const { auth } = useAuth()

	const [userData, setUserData] = useState('')
	const [role, setRole] = useState('')
	const [openEditUserModal, setOpenEditUserModal] = useState(false)
	const [openViewUserModal, setOpenViewUserModal] = useState(false)

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filterTerms, setFilterTerms] = useState({
		isEmailVerified: '',
		roles: '',
	})

	useEffect(() => {
		setSortKey('index')
		setSortOrder('asc')
	}, [auth])

	const sortedData = useCallback(
		() =>
			SortData({
				tableData: props.data,
				sortKey,
				reverse: sortOrder === 'desc',
				searchTerm,
				searchCols: ['name', 'email'],
				filterTerms,
			}),
		[props.data, sortKey, sortOrder, searchTerm, filterTerms]
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

	const results = sortedData()

	if (indexOfLastItem > results.length) {
		indexOfLastItem = results.length
	}

	const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	useEffect(() => {
		setCurrentPage(1)
	}, [itemsPerPage, searchTerm, filterTerms])

	const editUserHandler = (userData, role) => {
		setRole(role)
		setUserData(userData)
		setOpenEditUserModal(true)
	}

	const viewUserHandler = (userData) => {
		setUserData(userData)
		setOpenViewUserModal(true)
	}

	return (
		<>
			<Filters
				itemsPerPage={itemsPerPage}
				setItemsPerPage={setItemsPerPage}
				results={results}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchPlaceholder='Name / Email'
			>
				<div className='mx-6 flex items-center'>
					<p>Filter</p>

					<select
						className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
						name='statusFilter'
						id='statusFilter'
						value={filterTerms.isEmailVerified}
						onChange={(e) =>
							setFilterTerms((prev) => ({
								...prev,
								isEmailVerified: e.target.value,
							}))
						}
					>
						<option value=''>Any Status</option>
						<option value='true'>Verified</option>
						<option value='false'>Not Verified</option>
					</select>

					<select
						className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
						name='labFilter'
						id='labFilter'
						value={filterTerms.roles}
						onChange={(e) =>
							setFilterTerms((prev) => ({ ...prev, roles: e.target.value }))
						}
					>
						<option value=''>Any Lab</option>
						{props.labs
							.sort((a, b) =>
								a.labName.toLowerCase() > b.labName.toLowerCase() ? 1 : -1
							)
							.map((lab) => (
								<option key={lab._id} value={lab.labName}>
									{lab.labName}
								</option>
							))}
						<option value='-'>No Lab</option>
					</select>
				</div>
			</Filters>

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
								{currentItems.length === 0 ? (
									<tr>
										<td
											className='px-6 py-4 text-center'
											colSpan={tableHeaders.length}
										>
											No record found.
										</td>
									</tr>
								) : (
									currentItems.map((user) => (
										<tr key={user._id}>
											<td className='px-6 py-4'>{user.name}</td>
											<td className='px-6 py-4'>{user.email}</td>
											<td className='px-6 py-4'>
												<span
													className={`inline-flex rounded-full px-3 py-1 font-medium ${
														user.isEmailVerified
															? 'bg-green-100 text-green-600'
															: 'bg-red-100 text-red-600'
													}`}
												>
													{user.isEmailVerified ? 'Verified' : 'Not Verified'}
												</span>
											</td>
											<td className='space-y-0.5 px-6 py-4'>
												{user.roles.length !== 0
													? user.roles
															.sort((a, b) =>
																a.lab.labName.toLowerCase() >
																b.lab.labName.toLowerCase()
																	? 1
																	: -1
															)
															.map((role) => (
																<div
																	key={role.lab._id}
																	className='flex items-center'
																>
																	<p>{role.lab.labName}</p>
																	{!(
																		user.email === auth.email ||
																		role.role === ROLES_LIST.admin ||
																		role.role === ROLES_LIST.labOwner
																	) && (
																		<button
																			onClick={() =>
																				editUserHandler(user, role)
																			}
																			className='ml-2 text-gray-400 transition hover:text-indigo-700'
																		>
																			<PencilAltIcon className='h-5 w-5' />
																		</button>
																	)}
																</div>
															))
													: '-'}
											</td>
											<td className='px-6 py-4 text-center'>
												<button
													onClick={() => viewUserHandler(user)}
													className='flex font-medium text-indigo-600 transition hover:text-indigo-700'
												>
													View
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<Pagination
				filterTerms={filterTerms}
				searchTerm={searchTerm}
				indexOfFirstItem={indexOfFirstItem}
				indexOfLastItem={indexOfLastItem}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={results.length}
				paginate={paginate}
			/>

			{openEditUserModal && userData && role && (
				<EditUserModal
					user={userData}
					currentRole={role}
					openModal={openEditUserModal}
					setOpenModal={setOpenEditUserModal}
					setEditUserSuccess={props.setEditUserSuccess}
				/>
			)}

			{openViewUserModal && userData && (
				<ViewUserModal
					user={userData}
					openModal={openViewUserModal}
					setOpenModal={setOpenViewUserModal}
				/>
			)}
		</>
	)
}

export default UsersTable