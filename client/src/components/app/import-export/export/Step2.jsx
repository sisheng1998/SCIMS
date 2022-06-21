import React from 'react'
import CSVTable from './CSVTable'
import DownloadCSV from './DownloadCSV'

const Step2 = ({ data, setNextStep }) => {
	return (
		<>
			<label htmlFor='preview'>CSV File Preview</label>
			<CSVTable data={data} />
			<p className='mt-2 text-xs text-gray-400'>
				Single quotation marks (') are added for certain columns to prevent
				Excel auto formatting.
			</p>

			<DownloadCSV data={data} setNextStep={setNextStep} />
		</>
	)
}

export default Step2
