import React, { useCallback, useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import ImageLightBox from '../../../utils/ImageLightBox'
import { QrcodeIcon, ExclamationIcon } from '@heroicons/react/outline'
import { FormatChemicalDate } from '../../../utils/FormatDate'
import FormatAmountWithUnit from '../../../utils/FormatAmountWithUnit'
import ViewSDSModal from '../../sds/ViewSDSModal'

const ChemicalsTable = (props) => {
	const { auth } = useAuth()

	const [QRCodeInfo, setQRCodeInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)

	const [openViewSDSModal, setOpenViewSDSModal] = useState(false)
	const [CAS, setCAS] = useState('')

	const [viewDisposedChemicals, setViewDisposedChemicals] = useState(false)

	const tableHeaders = [
		{
			key: 'labName',
			label: 'Lab',
			sortable: true,
		},
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
	]

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filterTerms, setFilterTerms] = useState({
		labName: '',
		status: '',
	})

	useEffect(() => {
		setSortKey('index')
		setSortOrder('asc')
	}, [auth])

	const sortedData = useCallback(
		() =>
			SortData({
				tableData: viewDisposedChemicals
					? props.disposedChemicals
					: props.chemicals,
				sortKey,
				reverse: sortOrder === 'desc',
				searchTerm,
				searchCols: ['CAS', 'name'],
				filterTerms,
			}),
		[
			viewDisposedChemicals,
			props.chemicals,
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
				<div className='mx-6 flex items-center lg:ml-4 lg:mr-0'>
					<p>Filter</p>

					<select
						className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
						name='labFilter'
						id='labFilter'
						value={filterTerms.lab}
						onChange={(e) =>
							setFilterTerms((prev) => ({
								...prev,
								labName: e.target.value,
							}))
						}
					>
						<option value=''>Any Lab</option>
						{props.labs
							.sort((a, b) =>
								a.labName.toLowerCase() > b.labName.toLowerCase() ? 1 : -1
							)
							.map((lab, index) => (
								<option key={index} value={lab.labName}>
									Lab {lab.labName}
								</option>
							))}
					</select>

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
				</div>

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
									: props.chemicals.length === 0) ? (
									<tr>
										<td
											className='px-6 py-4 text-center'
											colSpan={tableHeaders.length}
										>
											{(
												viewDisposedChemicals
													? props.disposedChemicals.length === 0
													: props.chemicals.length === 0
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
											<tr className='hover:bg-indigo-50/30' key={chemical._id}>
												<td className='px-6 py-4'>Lab {chemical.labName}</td>

												<td className='px-6 py-4'>
													<p
														onClick={() => viewSDSHandler(chemical.CASId)}
														className='cursor-pointer transition hover:text-indigo-600'
													>
														{chemical.CASId.CASNo}
														{chemical.CASId.COCs.length !== 0 && (
															<span
																className='tooltip ml-1.5 whitespace-normal'
																data-tooltip='Chemical of Concerns'
															>
																<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
															</span>
														)}
													</p>
												</td>

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

												<td className='space-y-0.5 px-6 py-4 '>
													<p>
														{FormatAmountWithUnit(
															chemical.amount,
															chemical.unit
														)}
														{Number(chemical.amount) <=
															Number(chemical.minAmount) && (
															<span
																className='tooltip ml-1.5'
																data-tooltip='Low Amount'
															>
																<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
															</span>
														)}
													</p>
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
											</tr>
										)
									})
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

			{openViewImageModal && QRCodeInfo && (
				<ImageLightBox
					object={QRCodeInfo}
					type='QRCode'
					openModal={openViewImageModal}
					setOpenModal={setOpenViewImageModal}
				/>
			)}

			{CAS && openViewSDSModal && (
				<ViewSDSModal
					CAS={CAS}
					fromInventory={true}
					openModal={openViewSDSModal}
					setOpenModal={setOpenViewSDSModal}
				/>
			)}
		</>
	)
}

export default ChemicalsTable
