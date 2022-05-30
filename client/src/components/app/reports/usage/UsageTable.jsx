import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import FormatAmountWithUnit from '../../../utils/FormatAmountWithUnit'
import FormatDate from '../../../utils/FormatDate'
import ImageLightBox from '../../../utils/ImageLightBox'
import useAuth from '../../../../hooks/useAuth'
import GetLetterPicture from '../../../utils/GetLetterPicture'

const tableHeaders = [
	{
		key: 'date',
		label: 'Date',
		sortable: true,
	},
	{
		key: 'userName',
		label: 'User',
		sortable: true,
	},
	{
		key: 'chemicalName',
		label: 'Chemical',
		sortable: true,
	},
	{
		key: 'usage',
		label: 'Usage',
		sortable: false,
	},
	{
		key: 'changes',
		label: 'Changes',
		sortable: false,
	},
]

const UsageTable = ({ data }) => {
	const { auth } = useAuth()
	const [avatarInfo, setAvatarInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')

	const sortedData = useCallback(
		() =>
			SortData({
				tableData: data,
				sortKey,
				reverse: sortOrder === 'desc',
				searchTerm,
				searchCols: ['userName', 'userEmail', 'chemicalName', 'CASNo'],
				filterTerms: {},
			}),
		[data, sortKey, sortOrder, searchTerm]
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
	}, [itemsPerPage, searchTerm])

	let indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const results = sortedData()

	if (indexOfLastItem > results.length) {
		indexOfLastItem = results.length
	}

	const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	const viewImageHandler = (name, imageSrc) => {
		setAvatarInfo({ name, imageSrc })
		setOpenViewImageModal(true)
	}

	return (
		<>
			<Filters
				itemsPerPage={itemsPerPage}
				setItemsPerPage={setItemsPerPage}
				results={results}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchPlaceholder='User / Chemical'
			/>

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
									currentItems.map((log) => {
										const imageSrc = log.user.avatar
											? auth.avatarPath + log.user.avatar
											: GetLetterPicture(log.userName)

										return (
											<tr className='hover:bg-indigo-50/30' key={log._id}>
												<td className='px-6 py-4'>{FormatDate(log.date)}</td>

												<td className='px-6 py-4'>
													<div className='flex w-max items-center space-x-3'>
														<img
															src={imageSrc}
															alt='Avatar'
															className='h-12 w-12 cursor-pointer rounded-full object-cover'
															height='64'
															width='64'
															draggable={false}
															onClick={() =>
																viewImageHandler(log.userName, imageSrc)
															}
														/>

														<div>
															<p className='font-medium leading-5'>
																{log.userName}
																{auth.email.toLowerCase() ===
																	log.userEmail.toLowerCase() && (
																	<span className='ml-1.5 text-sm text-indigo-600'>
																		(You)
																	</span>
																)}
															</p>
															<p className='text-sm leading-4 text-gray-400'>
																{log.userEmail}
															</p>
														</div>
													</div>
												</td>

												<td className='px-6 py-4'>
													<p className='font-medium'>{log.chemicalName}</p>
													<p className='text-sm leading-4 text-gray-400'>
														{log.CASNo}
													</p>
												</td>

												<td className='px-6 py-4'>
													{FormatAmountWithUnit(log.usage, log.chemical.unit)}
												</td>

												<td className='px-6 py-4'>
													{log.originalAmount} →{' '}
													{FormatAmountWithUnit(
														log.originalAmount - log.usage,
														log.chemical.unit
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
				searchTerm={searchTerm}
				indexOfFirstItem={indexOfFirstItem}
				indexOfLastItem={indexOfLastItem}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={results.length}
				paginate={paginate}
			/>

			{openViewImageModal && avatarInfo && (
				<ImageLightBox
					object={avatarInfo}
					type='Avatar'
					openModal={openViewImageModal}
					setOpenModal={setOpenViewImageModal}
				/>
			)}
		</>
	)
}

export default UsageTable
