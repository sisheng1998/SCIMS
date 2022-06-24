import React from 'react'
import { CSVLink } from 'react-csv'
import { DownloadIcon } from '@heroicons/react/outline'
import { HEADERS } from '../../../../../config/import_export'

const DownloadTemplate = () => {
	return (
		<CSVLink
			data={[]}
			headers={HEADERS}
			filename='chemicals_template.csv'
			className='button button-outline justify-center'
			target='_blank'
		>
			Template
			<DownloadIcon className='ml-1.5 h-4 w-4 stroke-2' />
		</CSVLink>
	)
}

export default DownloadTemplate
