import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import ImageLightBox from '../../utils/ImageLightBox'
import useAuth from '../../../hooks/useAuth'
import GetLetterPicture from '../../utils/GetLetterPicture'

const tableHeaders = [
	{
		key: 'date',
		label: 'Date',
		sortable: true,
	},
	{
		key: 'name',
		label: 'User',
		sortable: true,
	},
	{
		key: 'description',
		label: 'Description',
		sortable: false,
	},
]

const ReportsTable = (props) => {
	const { auth } = useAuth()
	const [avatarInfo, setAvatarInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)

	const [sortKey, setSortKey] = useState('index')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filterTerms, setFilterTerms] = useState({
		days: 30,
	})

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
				searchPlaceholder='Name / Email'
			>
				<div className='mx-6 flex items-center'>
					<p>Last</p>
					<select
						className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
						name='daysFilter'
						id='daysFilter'
						value={filterTerms.days}
						onChange={(e) =>
							setFilterTerms((prev) => ({ ...prev, days: e.target.value }))
						}
					>
						<option value='30'>30 Days</option>
						<option value='60'>60 Days</option>
						<option value='90'>90 Days</option>
					</select>
				</div>
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
								{true ? (
									<tr>
										<td
											className='px-6 py-4 text-center'
											colSpan={tableHeaders.length}
										>
											No record found.
										</td>
									</tr>
								) : (
									currentItems.map((user) => {
										const imageSrc = user.avatar
											? auth.avatarPath + user.avatar
											: GetLetterPicture(user.name)

										return (
											<tr key={user._id}>
												<td className='px-6 py-4'>{user.matricNo}</td>

												<td className='px-6 py-4'>
													<div className='flex items-center space-x-3'>
														<img
															src={imageSrc}
															alt='Avatar'
															className='h-12 w-12 cursor-pointer rounded-full object-cover'
															height='64'
															width='64'
															draggable={false}
															onClick={() =>
																viewImageHandler(user.name, imageSrc)
															}
														/>

														<div>
															<p className='font-medium leading-5'>
																{user.name}
															</p>
															<p className='text-sm leading-4 text-gray-400'>
																{user.email}
															</p>
														</div>
													</div>
												</td>

												<td className='px-6 py-4 capitalize'>{user.role}</td>
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

export default ReportsTable
