const SortData = ({
	tableData,
	sortKey,
	reverse,
	searchTerm,
	searchCols,
	filterTerms,
}) => {
	if (!sortKey) return tableData

	const sortedData = tableData
		.filter(
			(data) =>
				searchCols.some(
					(col) =>
						data[col]
							.toString()
							.toLowerCase()
							.indexOf(searchTerm.toLowerCase()) > -1
				) &&
				Object.entries(filterTerms).every(
					([col, value]) =>
						data[col].toString().toLowerCase().indexOf(value.toLowerCase()) > -1
				)
		)
		.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1))

	if (reverse) {
		return sortedData.reverse()
	}

	return sortedData
}

export default SortData
