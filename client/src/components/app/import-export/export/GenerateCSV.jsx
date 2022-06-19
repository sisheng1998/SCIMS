import React, { useState } from 'react'
import { DownloadIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../hooks/useAuth'
import { COLUMNS, STATUSES } from '../../../../config/import_export'

const getValues = (objects) => objects.map((object) => object.value)

const GenerateCSV = ({ selectedColumns, selectedStatuses }) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const generateCSVHandler = async () => {
		setIsLoading(true)
		setErrorMessage('')

		try {
			const { data } = await axiosPrivate.post('/api/private/export', {
				labId: auth.currentLabId,
				columns: getValues(
					selectedColumns.length === 0 ? COLUMNS : selectedColumns
				),
				statuses: getValues(
					selectedStatuses.length === 0 ? STATUSES : selectedStatuses
				),
			})

			console.log(data)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}

		setIsLoading(false)
	}

	return (
		<div className='mt-9 flex items-center justify-end'>
			{errorMessage && (
				<p className='mr-auto flex items-center self-end text-sm font-medium text-red-600'>
					<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
					{errorMessage}
				</p>
			)}

			<button
				className='button button-outline justify-center px-4 py-3'
				onClick={generateCSVHandler}
				disabled={isLoading}
			>
				Generate CSV
				{isLoading ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						aria-hidden='true'
						className='ml-2 h-4 w-4 animate-spin stroke-2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
							className='origin-center -scale-x-100'
						></path>
					</svg>
				) : (
					<DownloadIcon className='ml-2 h-4 w-4 stroke-2' />
				)}
			</button>
		</div>
	)
}

export default GenerateCSV
