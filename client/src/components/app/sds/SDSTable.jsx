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
import ViewSDSModal from './ViewSDSModal'
import { FormatChemicalDate } from '../../utils/FormatDate'
import useMobile from '../../../hooks/useMobile'

const tableHeaders = [
	{
		key: 'CASNo',
		label: 'CAS No.',
		sortable: true,
	},
	{
		key: 'chemicalName',
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
		key: 'lastUpdated',
		label: 'Last Updated',
		sortable: true,
	},
	{
		key: 'action',
		label: 'Action',
		sortable: false,
	},
]

const SDSTable = ({ SDS, setRefresh }) => {
	const { auth } = useAuth()
	const isMobile = useMobile()

	const [openEditSDSModal, setOpenEditSDSModal] = useState(false)
	const [openViewSDSModal, setOpenViewSDSModal] = useState(false)
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
				searchCols: ['CASNo', 'chemicalName'],
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
		setOpenEditSDSModal(true)
	}

	const viewSDSHandler = (CAS) => {
		setCAS(CAS)
		setOpenViewSDSModal(true)
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
				{!isMobile && (
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
				)}
			</Filters>

			{isMobile ? (
				<>
					{currentItems.length === 0 ? (
						<div className='mb-4 rounded-lg bg-white p-4 text-center shadow'>
							No record found.
						</div>
					) : (
						currentItems.map((CAS) => (
							<div
								key={CAS._id}
								className='mb-4 rounded-lg bg-white p-4 text-sm shadow'
							>
								<div className='flex items-start justify-between space-x-4'>
									<div>
										<p className='text-lg font-medium leading-6 text-gray-900'>
											{CAS.CASNo}
										</p>
										<p className='text-gray-500'>{CAS.chemicalName}</p>
									</div>

									<a
										href={auth.SDSPath + CAS.SDS}
										target='_blank'
										rel='noreferrer'
										className='inline-flex items-center font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
									>
										View
									</a>
								</div>

								{CAS.classifications.length === 0 &&
								CAS.COCs.length === 0 ? null : (
									<div className='-mb-2 mt-4 text-xs'>
										{CAS.classifications.length !== 0
											? CLASSIFICATION_LIST.filter((classification) =>
													CAS.classifications.includes(classification)
											  ).map((classification, index) => (
													<span
														key={index}
														className={`mb-2 mr-2 inline-flex rounded-full px-3 py-1 font-medium ${
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
											: null}

										{CAS.COCs.length !== 0
											? COC_LIST.map(
													(security, index) =>
														CAS.COCs.includes(security) && (
															<span
																key={index}
																className={`mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 font-medium text-red-600 ${
																	security !== 'Other' ? 'tooltip' : ''
																}`}
																data-tooltip={COC_DESCRIPTION[index]}
															>
																{security}
															</span>
														)
											  )
											: null}
									</div>
								)}
							</div>
						))
					)}
				</>
			) : (
				<div className='mb-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
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

												<td className='px-6 py-4'>{CAS.chemicalName}</td>

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
														? COC_LIST.map(
																(security, index) =>
																	CAS.COCs.includes(security) && (
																		<span
																			key={index}
																			className={`inline-flex whitespace-normal rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600 ${
																				security !== 'Other' ? 'tooltip' : ''
																			}`}
																			data-tooltip={COC_DESCRIPTION[index]}
																		>
																			{security}
																		</span>
																	)
														  )
														: '-'}
												</td>

												<td className='px-6 py-4'>
													{FormatChemicalDate(CAS.lastUpdated)}
												</td>

												<td className='space-x-1 px-6 py-4'>
													<button
														onClick={() => viewSDSHandler(CAS)}
														className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
													>
														View
													</button>

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
			)}

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

			{CAS && openEditSDSModal && (
				<EditSDSModal
					CAS={CAS}
					openModal={openEditSDSModal}
					setOpenModal={setOpenEditSDSModal}
					setEditSDSSuccess={setRefresh}
				/>
			)}

			{CAS && openViewSDSModal && (
				<ViewSDSModal
					CAS={CAS}
					openModal={openViewSDSModal}
					setOpenModal={setOpenViewSDSModal}
				/>
			)}
		</>
	)
}

export default SDSTable
