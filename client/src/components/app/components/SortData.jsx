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
				Object.entries(filterTerms).every(([col, value]) => {
					// All labs filter for admin
					if (col === 'roles') {
						// No lab
						if (value === '-') {
							return data[col].length === 0
						}

						// Chosen lab name
						if (value !== '' && data[col].length !== 0) {
							return data[col].some(
								(role) => role.lab.labName.toLowerCase() === value.toLowerCase()
							)
						}
					}

					return (
						data[col].toString().toLowerCase().indexOf(value.toLowerCase()) > -1
					)
				})
		)
		.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1))

	if (reverse) {
		return sortedData.reverse()
	}

	return sortedData
}

export default SortData
