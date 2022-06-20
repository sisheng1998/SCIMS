import React from 'react'
import CSVTable from './CSVTable'
import DownloadCSV from './DownloadCSV'

const Step2 = ({ data, setNextStep }) => {
	return (
		<>
			<label htmlFor='preview'>CSV File Preview</label>
			<CSVTable data={data} />

			<DownloadCSV data={data} setNextStep={setNextStep} />
		</>
	)
}

export default Step2
