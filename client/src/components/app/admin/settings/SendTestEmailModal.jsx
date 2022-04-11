import React, { useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

const SendTestEmailModal = ({ emailConfig, openModal, setOpenModal }) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [testEmail, setTestEmail] = useState(auth.email)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const sendTestEmailHandler = async (e) => {
		e.preventDefault()
		setErrorMessage('')

		try {
			await axiosPrivate.put('/api/admin/settings/test-email', {
				emailConfig,
				testEmail,
			})
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			setSuccess(false)
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
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>Email Sent!</h2>
							<p>Kindly check your email for the test email.</p>
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Okay
							</button>
						</>
					) : (
						<>
							<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
								<h4>Send Test Email</h4>
								<XIcon
									className='h-5 w-5 cursor-pointer hover:text-indigo-600'
									onClick={closeHandler}
								/>
							</div>

							{errorMessage && (
								<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
									<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
									{errorMessage}
								</p>
							)}

							<div className='mb-6'>
								<label htmlFor='sender' className='mb-1'>
									Sender (Name/Email)
								</label>
								{emailConfig.FROM_NAME + ` <${emailConfig.FROM_EMAIL}>`}
							</div>

							<div className='flex space-x-6'>
								<div className='flex-1'>
									<label htmlFor='mailServer' className='mb-1'>
										Mail Server (Host/Port)
									</label>
									{emailConfig.EMAIL_HOST + `:${emailConfig.EMAIL_PORT}`}
								</div>

								<div className='flex-1'>
									<label htmlFor='serverUsername' className='mb-1'>
										SMTP Username
									</label>
									{emailConfig.EMAIL_USERNAME}
								</div>
							</div>

							<hr className='my-6 border-gray-200' />

							<form
								onSubmit={sendTestEmailHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<label htmlFor='testEmail' className='required-input-label'>
									Email Address
								</label>
								<input
									className='w-full'
									type='email'
									name='testEmail'
									id='testEmail'
									placeholder='Enter email address'
									required
									value={testEmail}
									onChange={(e) => setTestEmail(e.target.value)}
								/>
								<p className='mt-2 text-xs text-gray-400'>
									Enter email address where test email will be sent.
								</p>

								<div className='mt-9 flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button className='ml-6 w-40' type='submit'>
										Send
									</button>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</Dialog>
	)
}

export default SendTestEmailModal
