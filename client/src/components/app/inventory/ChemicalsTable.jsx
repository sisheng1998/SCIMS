import React, { useCallback, useState, useEffect } from 'react'
import ROLES_LIST from '../../../config/roles_list'
import useAuth from '../../../hooks/useAuth'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import ImageLightBox from '../../utils/ImageLightBox'
import {
	PencilAltIcon,
	QrcodeIcon,
	ExclamationIcon,
	LocationMarkerIcon,
	BeakerIcon,
	CalendarIcon,
} from '@heroicons/react/outline'
import { FormatChemicalDate } from '../../utils/FormatDate'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'
import { useNavigate } from 'react-router-dom'
import UpdateAmountModal from './components/UpdateAmountModal'
import useMobile from '../../../hooks/useMobile'

const ChemicalsTable = (props) => {
	const { auth } = useAuth()
	const navigate = useNavigate()
	const isMobile = useMobile()

	const [QRCodeInfo, setQRCodeInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)

	const [chemicalInfo, setChemicalInfo] = useState('')
	const [openUpdateAmountModal, setOpenUpdateAmountModal] = useState(false)

	const [viewDisposedChemicals, setViewDisposedChemicals] = useState(false)

	const tableHeaders = [
		{
			key: 'CAS',
			label: 'CAS No.',
			sortable: true,
		},
		{
			key: 'name',
			label: 'Name',
			sortable: true,
		},
		{
			key: 'location',
			label: 'Location',
			sortable: true,
		},
		{
			key: 'storageGroup',
			label: 'Group',
			sortable: true,
		},
		{
			key: 'amount',
			label: 'Amount',
			sortable: false,
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
		},
		{
			key: viewDisposedChemicals ? 'disposedDate' : 'expirationDate',
			label: viewDisposedChemicals ? 'Dis. Date' : 'Exp. Date',
			sortable: true,
		},
		{
			key: 'action',
			label: 'Action',
			sortable: false,
		},
	]

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filterTerms, setFilterTerms] = useState({
		status: '',
		location: '',
	})

	useEffect(() => {
		setSortKey('index')
		setSortOrder('asc')
	}, [auth])

	const sortedData = useCallback(
		() =>
			SortData({
				tableData: viewDisposedChemicals ? props.disposedChemicals : props.data,
				sortKey,
				reverse: sortOrder === 'desc',
				searchTerm,
				searchCols: ['CAS', 'name'],
				filterTerms,
			}),
		[
			viewDisposedChemicals,
			props.data,
			props.disposedChemicals,
			sortKey,
			sortOrder,
			searchTerm,
			filterTerms,
		]
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
	}, [itemsPerPage, searchTerm, filterTerms, viewDisposedChemicals])

	let indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const results = sortedData()

	if (indexOfLastItem > results.length) {
		indexOfLastItem = results.length
	}

	const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	const viewImageHandler = (name, imageSrc) => {
		setQRCodeInfo({ name, imageSrc })
		setOpenViewImageModal(true)
	}

	const updateAmountHandler = (chemical) => {
		setChemicalInfo(chemical)
		setOpenUpdateAmountModal(true)
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
							name='statusFilter'
							id='statusFilter'
							value={filterTerms.status}
							onChange={(e) =>
								setFilterTerms((prev) => ({ ...prev, status: e.target.value }))
							}
						>
							<option value=''>Any Status</option>
							<option value='Normal'>Normal</option>
							<option value='Low Amount'>Low Amount</option>
							<option value='Expiring Soon'>Expiring Soon</option>
							<option value='Expired'>Expired</option>
						</select>

						<select
							className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
							name='locationFilter'
							id='locationFilter'
							value={filterTerms.location}
							onChange={(e) =>
								setFilterTerms((prev) => ({
									...prev,
									location: e.target.value,
								}))
							}
						>
							<option value=''>Any Location</option>
							{props.locations
								.sort((a, b) =>
									a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
								)
								.map((location) => (
									<option key={location._id} value={location.name}>
										{location.name}
									</option>
								))}
							<option value='-'>No Location</option>
						</select>
					</div>
				)}

				{props.disposedChemicals.length !== 0 && (
					<label
						className='mb-0 mr-6 flex cursor-pointer items-center whitespace-nowrap font-normal lg:mr-0 lg:mt-4'
						htmlFor='showDisposedChemicals'
					>
						Disposed Chemicals
						<input
							type='checkbox'
							className='peer hidden'
							id='showDisposedChemicals'
							onChange={() => setViewDisposedChemicals(!viewDisposedChemicals)}
						/>
						<span className='relative flex before:ml-2 before:h-5 before:w-9 before:rounded-full before:bg-gray-300 before:transition after:absolute after:top-1/2 after:left-0 after:ml-2.5 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition before:peer-checked:bg-indigo-600 after:peer-checked:translate-x-full'></span>
					</label>
				)}
			</Filters>

			{isMobile ? (
				<>
					{currentItems.length === 0 ||
					(viewDisposedChemicals
						? props.disposedChemicals.length === 0
						: props.data.length === 0) ? (
						<div className='rounded-lg bg-white p-4 text-center shadow'>
							{(
								viewDisposedChemicals
									? props.disposedChemicals.length === 0
									: props.data.length === 0
							)
								? 'No chemical added.'
								: 'No record found.'}
						</div>
					) : (
						currentItems.map((chemical) => {
							let classes

							if (chemical.status === 'Normal') {
								classes = 'bg-green-100 text-green-600'
							} else if (
								chemical.status === 'Expired' ||
								chemical.status === 'Disposed'
							) {
								classes = 'bg-red-100 text-red-600'
							} else {
								// Low Amount / Expiring Soon
								classes = 'bg-yellow-100 text-yellow-600'
							}

							return (
								<div
									key={chemical._id}
									className='mb-4 rounded-lg bg-white p-4 text-sm shadow'
								>
									<div className='mb-2 flex items-center justify-between'>
										<p className='text-xs'>
											<span
												className={`inline-flex rounded-full px-2 py-0.5 font-medium ${classes}`}
											>
												{chemical.status}
											</span>
										</p>

										<button
											onClick={() => navigate(`/inventory/${chemical._id}`)}
											className='inline-flex items-center font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
										>
											View
										</button>
									</div>

									<p className='text-lg font-medium leading-6 text-gray-900'>
										{chemical.name}
									</p>
									<p className='mb-2 text-gray-500'>{chemical.CASId.CASNo}</p>

									<div className='flex flex-wrap items-center'>
										<p className='mt-2 mr-4 flex items-center'>
											<LocationMarkerIcon className='mr-1.5 inline-block h-4 w-4 stroke-2 text-indigo-600' />
											{chemical.location}
										</p>

										<p className='mt-2 mr-4 flex items-center'>
											<BeakerIcon className='mr-1.5 inline-block h-4 w-4 stroke-2 text-indigo-600' />
											{FormatAmountWithUnit(chemical.amount, chemical.unit)}
										</p>

										<p className='mt-2 flex items-center'>
											<CalendarIcon className='mr-1.5 inline-block h-4 w-4 stroke-2 text-indigo-600' />
											{FormatChemicalDate(chemical.expirationDate)}
										</p>
									</div>

									{viewDisposedChemicals && (
										<p className='mt-2 text-xs text-gray-500'>
											Disposed At:{' '}
											<span className='font-semibold'>
												{FormatChemicalDate(chemical.disposedDate)}
											</span>
										</p>
									)}
								</div>
							)
						})
					)}
				</>
			) : (
				<div className='mb-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
					<div className='overflow-x-auto'>
						<div className='border-b border-gray-200'>
							<table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
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
									{currentItems.length === 0 ||
									(viewDisposedChemicals
										? props.disposedChemicals.length === 0
										: props.data.length === 0) ? (
										<tr>
											<td
												className='px-6 py-4 text-center'
												colSpan={tableHeaders.length}
											>
												{(
													viewDisposedChemicals
														? props.disposedChemicals.length === 0
														: props.data.length === 0
												)
													? 'No chemical added.'
													: 'No record found.'}
											</td>
										</tr>
									) : (
										currentItems.map((chemical) => {
											let classes

											if (chemical.status === 'Normal') {
												classes = 'bg-green-100 text-green-600'
											} else if (
												chemical.status === 'Expired' ||
												chemical.status === 'Disposed'
											) {
												classes = 'bg-red-100 text-red-600'
											} else {
												// Low Amount / Expiring Soon
												classes = 'bg-yellow-100 text-yellow-600'
											}

											return (
												<tr key={chemical._id}>
													<td className='px-6 py-4'>{chemical.CASId.CASNo}</td>

													<td className='px-6 py-4'>
														<div className='flex items-center space-x-2'>
															<div className='tooltip' data-tooltip='QR Code'>
																<QrcodeIcon
																	className='h-6 w-6 cursor-pointer text-gray-400 transition hover:text-indigo-700 focus:outline-none'
																	onClick={() =>
																		viewImageHandler(
																			chemical.name,
																			chemical.QRCode
																		)
																	}
																/>
															</div>

															<p>{chemical.name}</p>
														</div>
													</td>

													<td className='px-6 py-4'>
														{chemical.location}
														{chemical.storageGroup &&
															chemical.location !== '-' &&
															!chemical.allowedStorageGroups.includes(
																chemical.storageGroup
															) && (
																<span
																	className='tooltip ml-1.5 whitespace-normal'
																	data-tooltip={`Group ${chemical.storageGroup} is not allowed in this location`}
																>
																	<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
																</span>
															)}
													</td>

													<td className='px-6 py-4'>
														{chemical.storageGroup
															? chemical.storageGroup
															: '-'}
													</td>

													<td className='space-y-0.5 px-6 py-4 '>
														<div className='flex items-center space-x-2'>
															<p>
																{FormatAmountWithUnit(
																	chemical.amount,
																	chemical.unit
																)}
																{Number(chemical.amount) <
																	Number(chemical.minAmount) && (
																	<span
																		className='tooltip ml-1.5'
																		data-tooltip='Low Amount'
																	>
																		<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
																	</span>
																)}
															</p>
															{auth.currentRole >= ROLES_LIST.undergraduate &&
																!viewDisposedChemicals && (
																	<button
																		onClick={() =>
																			updateAmountHandler(chemical)
																		}
																		className='tooltip text-gray-400 transition hover:text-indigo-700 focus:outline-none'
																		data-tooltip='Update Amount'
																	>
																		<PencilAltIcon className='h-5 w-5' />
																	</button>
																)}
														</div>
													</td>

													<td className='px-6 py-4'>
														<span
															className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
														>
															{chemical.status}
														</span>
													</td>

													<td className='px-6 py-4'>
														{FormatChemicalDate(
															viewDisposedChemicals
																? chemical.disposedDate
																: chemical.expirationDate
														)}
													</td>

													<td className='space-x-1 px-6 py-4'>
														<button
															onClick={() =>
																navigate(`/inventory/${chemical._id}`)
															}
															className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
														>
															View
														</button>
														{auth.currentRole >= ROLES_LIST.postgraduate &&
															!viewDisposedChemicals && (
																<>
																	<span>/</span>
																	<button
																		onClick={() =>
																			navigate(`/inventory/${chemical._id}`, {
																				state: { edit: true },
																			})
																		}
																		className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
																	>
																		Edit
																	</button>
																</>
															)}
													</td>
												</tr>
											)
										})
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

			{openViewImageModal && QRCodeInfo && (
				<ImageLightBox
					object={QRCodeInfo}
					type='QRCode'
					openModal={openViewImageModal}
					setOpenModal={setOpenViewImageModal}
				/>
			)}

			{openUpdateAmountModal && chemicalInfo && (
				<UpdateAmountModal
					chemical={chemicalInfo}
					openModal={openUpdateAmountModal}
					setOpenModal={setOpenUpdateAmountModal}
					setUpdateAmountSuccess={props.setUpdateAmountSuccess}
				/>
			)}
		</>
	)
}

export default ChemicalsTable
