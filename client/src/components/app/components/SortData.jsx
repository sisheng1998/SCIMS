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

					// Filter for activity logs
					if (col === 'period') {
						const currentMonth = new Date().getMonth() + 1
						const loggedMonth = new Date(data['date']).getMonth() + 1

						if (value.option === 'thisMonth') {
							return loggedMonth === currentMonth
						} else if (value.option === 'lastMonth') {
							return loggedMonth === currentMonth - 1
						} else if (value.option === 'custom') {
							const loggedDate = new Date(data['date']).toLocaleDateString(
								'en-CA'
							)
							const date = new Date(loggedDate).getTime()
							const startDate = new Date(value.startDate).getTime()
							const endDate = new Date(value.endDate).getTime()

							return date <= endDate && date >= startDate
						}

						return true
					}

					// Filter for stock check report
					if (col === 'amount') {
						if (value === '==') {
							return data[col] === data['amountInDB']
						} else if (value === '!=') {
							return data[col] !== data['amountInDB']
						}

						return true
					}

					// Filter for SDS
					if (col === 'classifications' || col === 'COCs') {
						// No classifications or COCs
						if (value === '-') {
							return data[col].length === 0
						}

						if (value !== '' && data[col].length !== 0) {
							return data[col].some(
								(security) => security.toLowerCase() === value.toLowerCase()
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
