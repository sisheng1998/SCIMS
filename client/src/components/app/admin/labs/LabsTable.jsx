import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import EditLabModal from './EditLabModal'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'

const tableHeaders = [
	{
		key: 'labName',
		label: 'Name',
		sortable: true,
	},
	{
		key: 'ownerName',
		label: 'Lab Owner',
		sortable: true,
	},
	{
		key: 'ownerEmail',
		label: 'Email',
		sortable: true,
	},
	{
		key: 'status',
		label: 'Status',
		sortable: true,
	},
	{
		key: 'action',
		label: 'Action',
		sortable: false,
	},
]

const LabsTable = (props) => {
	const { auth } = useAuth()

	const [labData, setLabData] = useState('')
	const [isEdit, setIsEdit] = useState(false)
	const [openEditLabModal, setOpenEditLabModal] = useState(false)

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filterTerms, setFilterTerms] = useState({
		status: '',
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
				searchCols: ['labName', 'ownerName', 'ownerEmail'],
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

	const editLabHandler = (labData, isEdit) => {
		setLabData(labData)
		setIsEdit(isEdit)
		setOpenEditLabModal(true)
	}

	return (
		<>
			<Filters
				itemsPerPage={itemsPerPage}
				setItemsPerPage={setItemsPerPage}
				results={results}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchPlaceholder='Name / Lab Owner / Email'
			>
				<div className='mx-6 flex items-center'>
					<p>Filter</p>

					<select
						className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
						name='statusFilter'
						id='statusFilter'
						value={filterTerms.status}
						onChange={(e) =>
							setFilterTerms((prev) => ({ ...prev, status: e.target.value }))
						}
					>
						<option value=''>Any Status</option>
						<option value='In Use'>In Use</option>
						<option value='Not In Use'>Not In Use</option>
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
									currentItems.map((lab) => (
										<tr key={lab._id}>
											<td className='px-6 py-4'>{lab.labName}</td>
											<td className='px-6 py-4'>{lab.ownerName}</td>
											<td className='px-6 py-4'>{lab.ownerEmail}</td>
											<td className='px-6 py-4'>
												<span
													className={`inline-flex rounded-full px-3 py-1 font-medium ${
														lab.status === 'In Use'
															? 'bg-green-100 text-green-600'
															: 'bg-red-100 text-red-600'
													}`}
												>
													{lab.status}
												</span>
											</td>
											<td className='px-6 py-4 text-center'>
												{auth.email === lab.ownerEmail &&
												auth.roles.some(
													(role) =>
														role.role === ROLES_LIST.admin &&
														role.lab._id === lab._id
												) ? (
													<button
														onClick={() => editLabHandler(lab, false)}
														className='flex font-medium text-indigo-600 transition hover:text-indigo-700'
													>
														View
													</button>
												) : (
													<button
														onClick={() => editLabHandler(lab, true)}
														className='flex font-medium text-indigo-600 transition hover:text-indigo-700'
													>
														Edit
													</button>
												)}
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

			{openEditLabModal && labData && (
				<EditLabModal
					lab={labData}
					isEdit={isEdit}
					openModal={openEditLabModal}
					setOpenModal={setOpenEditLabModal}
					users={props.users}
				/>
			)}
		</>
	)
}

export default LabsTable