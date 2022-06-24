import React, { useState } from 'react'
import {
	ArrowNarrowRightIcon,
	ArrowLeftIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../../hooks/useAuth'

const ImportChemicals = ({
	processedData,
	mappedColumns,
	errorMessage,
	setErrorMessage,
	setStep,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [isLoading, setIsLoading] = useState(false)

	const importChemicalsHandler = async () => {
		setIsLoading(true)
		setErrorMessage('')

		try {
			const { data } = await axiosPrivate.post('/api/private/import', {
				labId: auth.currentLabId,
			})

			setIsLoading(false)
			//setStep(4)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}

			setIsLoading(false)
		}
	}

	return (
		<div className='mt-9 flex items-center justify-end'>
			<div className='mr-auto space-y-2 self-end'>
				{errorMessage && (
					<p className='flex items-center text-sm font-medium text-red-600'>
						<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
						{errorMessage}
					</p>
				)}

				<p
					onClick={() => {
						setErrorMessage('')
						setStep(2)
					}}
					className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
				>
					<ArrowLeftIcon className='mr-1 h-4 w-4' />
					Return Back
				</p>
			</div>

			<button
				className='button button-outline justify-center px-4 py-3'
				onClick={importChemicalsHandler}
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						Loading
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
					</>
				) : (
					<>
						Import Chemicals
						<ArrowNarrowRightIcon className='ml-2 h-4 w-4 stroke-2' />
					</>
				)}
			</button>
		</div>
	)
}

export default ImportChemicals
