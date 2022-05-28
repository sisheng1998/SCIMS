import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const ConfirmationModal = ({
	action,
	chemicals,
	setChemicals,
	setStarted,
	openModal,
	setOpenModal,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const divRef = useRef(null)

	const labId = auth.currentLabId
	const storageName = labId + '_chemicals'
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const actionHandler = async () => {
		setErrorMessage('')

		if (action === 'complete') {
			const missingChemicals = auth.stockCheck.chemicals
				.filter(
					(chemicalItem) =>
						!chemicals.some(
							(chemical) => chemicalItem._id === chemical.chemicalId
						)
				)
				.map((chemical) => ({
					chemicalId: chemical._id,
					CASNo: chemical.CASId.CASNo,
					name: chemical.name,
					location: chemical.location,
					unit: chemical.unit,
					amountInDB: chemical.amount,
				}))

			const disposedChemicals = auth.stockCheck.disposedChemicals.map(
				(chemical) => ({
					chemicalId: chemical._id,
					CASNo: chemical.CASId.CASNo,
					name: chemical.name,
					location: chemical.location,
					unit: chemical.unit,
					amountInDB: chemical.amount,
				})
			)

			try {
				await axiosPrivate.post('/api/private/stock-check', {
					labId,
					chemicals,
					missingChemicals,
					disposedChemicals,
				})
				setSuccess(true)
			} catch (error) {
				if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				} else {
					setErrorMessage('Oops. Something went wrong. Please try again later.')
				}
			}
		} else {
			setSuccess(true)
		}
	}

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			setSuccess(false)
			setChemicals([])
			localStorage.removeItem(storageName)
			setStarted(false)
		}

		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			initialFocus={divRef}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div
				ref={divRef}
				className='flex min-h-screen items-center justify-center'
			>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative m-4 w-full max-w-sm rounded-lg bg-white p-6 shadow ${
						success ? 'text-center' : ''
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>
								{action === 'complete'
									? 'Process Completed!'
									: 'Process Cancelled!'}
							</h2>
							{action === 'complete' ? (
								<p>
									The records have been saved and the stock check report have
									been generated.
								</p>
							) : (
								<p>The stock check process has been cancelled.</p>
							)}
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Okay
							</button>
						</>
					) : (
						<>
							<h4 className='mb-2'>
								{action === 'complete'
									? 'Complete Stock Check'
									: 'Cancel Stock Check'}
							</h4>
							{action === 'complete' ? (
								<>
									<p>Are you sure the stock check process is completed?</p>
									<p className='mt-2 text-sm text-gray-500'>
										The records will be saved and a stock check report will be
										generated.
									</p>
								</>
							) : (
								<>
									<p>
										Are you sure you want to cancel the stock check process?
									</p>
									<p className='mt-2 text-sm text-gray-500'>
										All of the records will be permanently removed. This action
										cannot be undone.
									</p>
								</>
							)}

							{errorMessage && (
								<p className='mt-6 flex items-center text-sm font-medium text-red-600'>
									<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
									{errorMessage}
								</p>
							)}

							<div className='mt-9 flex items-center justify-end'>
								<span
									onClick={closeHandler}
									className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
								>
									No
								</span>
								<button
									onClick={actionHandler}
									className='button button-solid ml-6 w-32 justify-center'
								>
									Yes
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</Dialog>
	)
}

export default ConfirmationModal
