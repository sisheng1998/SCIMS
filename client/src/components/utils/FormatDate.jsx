const FormatDate = (value) => {
	const options = {
		day: 'numeric',
		year: 'numeric',
		month: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hourCycle: 'h12',
	}

	const formattedDate = new Date(value)

	return formattedDate.toLocaleString('en-GB', options).toUpperCase()
}

export default FormatDate

const FormatChemicalDate = (value) =>
	new Date(value).toLocaleDateString('en-GB')

export { FormatChemicalDate }
