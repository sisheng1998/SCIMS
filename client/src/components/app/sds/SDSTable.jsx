import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import {
	CLASSIFICATION_LIST,
	COC_LIST,
	COC_DESCRIPTION,
} from '../../../config/safety_security_list'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import EditSDSModal from './EditSDSModal'

const tableHeaders = [
	{
		key: 'CASNo',
		label: 'CAS No.',
		sortable: true,
	},
	{
		key: 'SDS',
		label: 'Name',
		sortable: true,
	},
	{
		key: 'classifications',
		label: 'Classifications',
		sortable: false,
	},
	{
		key: 'COCs',
		label: 'Chemical of Concerns',
		sortable: false,
	},
	{
		key: 'action',
		label: 'Action',
		sortable: false,
	},
]

const SDSTable = ({ SDS, setRefresh }) => {
	const { auth } = useAuth()

	const [openModal, setOpenModal] = useState(false)
	const [CAS, setCAS] = useState('')

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filterTerms, setFilterTerms] = useState({
		classifications: '',
		COCs: '',
	})

	const sortedData = useCallback(
		() =>
			SortData({
				tableData: SDS,
				sortKey,
				reverse: sortOrder === 'desc',
				searchTerm,
				searchCols: ['CASNo', 'SDS'],
				filterTerms,
			}),
		[SDS, sortKey, sortOrder, searchTerm, filterTerms]
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

	useEffect(() => {
		setCurrentPage(1)
	}, [itemsPerPage, searchTerm, filterTerms])

	let indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const results = sortedData()

	if (indexOfLastItem > results.length) {
		indexOfLastItem = results.length
	}

	const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	const editSDSHandler = (CAS) => {
		setCAS(CAS)
		setOpenModal(true)
	}

	return (
		<>
			<Filters
				itemsPerPage={itemsPerPage}
				setItemsPerPage={setItemsPerPage}
				results={results}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchPlaceholder='CAS No. / Name'
			>
				<div className='mx-6 flex items-center lg:ml-4 lg:mr-0'>
					<p>Filter</p>

					<select
						className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
						name='classificationFilter'
						id='classificationFilter'
						value={filterTerms.classifications}
						onChange={(e) =>
							setFilterTerms((prev) => ({
								...prev,
								classifications: e.target.value,
							}))
						}
					>
						<option value=''>Any Classification</option>
						{CLASSIFICATION_LIST.map((classification, index) => (
							<option key={index} value={classification}>
								{classification}
							</option>
						))}
						<option value='-'>No Classification</option>
					</select>

					<select
						className='ml-2 max-w-xs p-1 pl-2 pr-8 text-sm text-gray-700'
						name='COCFilter'
						id='COCFilter'
						value={filterTerms.COCs}
						onChange={(e) =>
							setFilterTerms((prev) => ({ ...prev, COCs: e.target.value }))
						}
					>
						<option value=''>Any Chemical of Concern</option>
						{COC_LIST.map((COC, index) => (
							<option key={index} value={COC}>
								{index !== COC_DESCRIPTION.length - 1
									? `${COC_DESCRIPTION[index]} (${COC})`
									: COC}
							</option>
						))}
						<option value='-'>No Chemical of Concern</option>
					</select>
				</div>
			</Filters>

			<div className='mb-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
				<div className='overflow-x-auto'>
					<div className='border-b border-gray-200'>
						<table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
							<thead className='bg-gray-50'>
								<tr>
									{tableHeaders.map(
										(header) =>
											!header.hide && (
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
											)
									)}
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
									currentItems.map((CAS) => (
										<tr className='hover:bg-indigo-50/30' key={CAS._id}>
											<td className='px-6 py-4'>{CAS.CASNo}</td>

											<td className='px-6 py-4'>{CAS.SDS}</td>

											<td className='space-x-2 px-6 py-4'>
												{CAS.classifications.length !== 0
													? CLASSIFICATION_LIST.filter((classification) =>
															CAS.classifications.includes(classification)
													  ).map((classification, index) => (
															<span
																key={index}
																className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
																	classification === CLASSIFICATION_LIST[8] ||
																	classification === CLASSIFICATION_LIST[7] ||
																	classification === CLASSIFICATION_LIST[6] ||
																	classification === CLASSIFICATION_LIST[5]
																		? 'bg-blue-100 text-blue-600'
																		: 'bg-yellow-100 text-yellow-600'
																}`}
															>
																{classification}
															</span>
													  ))
													: '-'}
											</td>

											<td className='space-x-2 px-6 py-4'>
												{CAS.COCs.length !== 0
													? COC_LIST.filter((security) =>
															CAS.COCs.includes(security)
													  ).map((security, index) => (
															<span
																key={index}
																className='inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600'
															>
																{security}
															</span>
													  ))
													: '-'}
											</td>

											<td className='space-x-1 px-6 py-4'>
												<a
													className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
													href={auth.SDSPath + CAS.SDS}
													target='_blank'
													rel='noreferrer'
												>
													View
												</a>

												{auth.currentRole >= ROLES_LIST.postgraduate && (
													<>
														<span>/</span>
														<button
															onClick={() => editSDSHandler(CAS)}
															className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
														>
															Edit
														</button>
													</>
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

			{CAS && openModal && (
				<EditSDSModal
					CAS={CAS}
					openModal={openModal}
					setOpenModal={setOpenModal}
					setEditSDSSuccess={setRefresh}
				/>
			)}
		</>
	)
}

export default SDSTable
