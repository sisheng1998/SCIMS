const FormatDate = (value) => {
	const options = {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
	}

	const formattedDate = new Date(value)

	return formattedDate.toLocaleString('en-US', options)
}

export default FormatDate
