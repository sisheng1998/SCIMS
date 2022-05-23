import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../components/SortData'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import ChemicalCard from './ChemicalCard'

const ChemicalsLoop = ({ chemicals, setChemicals }) => {
	const [searchTerm, setSearchTerm] = useState('')

	const sortedData = useCallback(
		() =>
			SortData({
				tableData: chemicals,
				sortKey: 'index',
				reverse: false,
				searchTerm,
				searchCols: ['CASNo', 'name'],
				filterTerms: {},
			}),
		[chemicals, searchTerm]
	)

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	useEffect(() => {
		setCurrentPage(1)
	}, [searchTerm])

	let indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const results = sortedData()

	if (indexOfLastItem > results.length) {
		indexOfLastItem = results.length
	}

	const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

	const paginate = (pageNumber) => setCurrentPage(pageNumber)

	return (
		<>
			<Filters
				itemsPerPage={itemsPerPage}
				results={results}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchPlaceholder='CAS No. / Name'
			/>

			{currentItems.length === 0 ? (
				<div className='mb-4 rounded-lg bg-white p-4 text-center shadow'>
					No record found.
				</div>
			) : (
				currentItems.map((chemical, index) => (
					<ChemicalCard
						key={index}
						chemical={chemical}
						chemicals={chemicals}
						setChemicals={setChemicals}
					/>
				))
			)}

			<Pagination
				searchTerm={searchTerm}
				indexOfFirstItem={indexOfFirstItem}
				indexOfLastItem={indexOfLastItem}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={results.length}
				paginate={paginate}
			/>
		</>
	)
}

export default ChemicalsLoop
