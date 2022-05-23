import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
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

	const labId = auth.currentLabId
	const storageName = labId + '_chemicals'
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const actionHandler = async () => {
		setErrorMessage('')

		if (action === 'complete') {
			try {
				await axiosPrivate.post('/api/private/stock-check', {
					labId,
					chemicals,
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
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-3xl'
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
							<XIcon
								className='absolute right-4 top-4 h-5 w-5 cursor-pointer hover:text-indigo-600'
								onClick={closeHandler}
							/>

							<h4 className='mb-2'>
								{action === 'complete'
									? 'Complete Stock Check'
									: 'Cancel Stock Check'}
							</h4>
							<p>
								{action === 'complete'
									? 'Are you sure the stock check process is completed? The records will be saved and a stock check report will be generated.'
									: 'Are you sure you want to cancel stock check? All of the records will be permanently removed. This action cannot be undone.'}
							</p>

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
									className='button button-solid ml-6 w-40 justify-center'
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
