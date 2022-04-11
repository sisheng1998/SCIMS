import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ViewPasswordToggle from '../../../utils/ViewPasswordToggle'
import SendTestEmailModal from './SendTestEmailModal'

const EditEmailConfigModal = ({
	settings,
	setEditSuccess,
	openModal,
	setOpenModal,
}) => {
	const axiosPrivate = useAxiosPrivate()

	const [fromName, setFromName] = useState(settings.FROM_NAME)
	const [fromEmail, setFromEmail] = useState(settings.FROM_EMAIL)
	const [host, setHost] = useState(settings.EMAIL_HOST)
	const [port, setPort] = useState(settings.EMAIL_PORT)
	const [username, setUsername] = useState(settings.EMAIL_USERNAME)
	const [password, setPassword] = useState(settings.EMAIL_PASSWORD)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [openSendTestEmailModal, setOpenSendTestEmailModal] = useState(false)

	const editEmailConfigHandler = async (e) => {
		e.preventDefault()

		try {
			const newSettings = {
				...settings,
				FROM_NAME: fromName,
				FROM_EMAIL: fromEmail,
				EMAIL_HOST: host,
				EMAIL_PORT: port,
				EMAIL_USERNAME: username,
				EMAIL_PASSWORD: password,
			}
			await axiosPrivate.put('/api/admin/settings', newSettings)
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
		setAllowed(
			(fromName !== '' && fromName !== settings.FROM_NAME) ||
				(fromEmail !== '' && fromEmail !== settings.FROM_EMAIL) ||
				(host !== '' && host !== settings.EMAIL_HOST) ||
				(port !== '' && port !== settings.EMAIL_PORT) ||
				(username !== '' && username !== settings.EMAIL_USERNAME) ||
				(password !== '' && password !== settings.EMAIL_PASSWORD)
		)
	}, [settings, fromName, fromEmail, host, port, username, password])

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			setSuccess(false)
			setEditSuccess(true)
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
								Configuration Updated!
							</h2>
							<p>The email configuration has been updated.</p>
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
								<h4>Edit Email Configuration</h4>
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

							<form
								onSubmit={editEmailConfigHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<div className='mb-6 flex space-x-6'>
									<div className='flex-1'>
										<label
											htmlFor='editFromName'
											className='required-input-label'
										>
											From Name
										</label>
										<input
											className='w-full'
											type='text'
											name='editFromName'
											id='editFromName'
											placeholder='Enter name'
											required
											value={fromName}
											onChange={(e) => setFromName(e.target.value)}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Name of the sender.
										</p>
									</div>

									<div className='flex-1'>
										<label
											htmlFor='editFromEmail'
											className='required-input-label'
										>
											From Email
										</label>
										<input
											className='w-full'
											type='text'
											name='editFromEmail'
											id='editFromEmail'
											placeholder='Enter email'
											required
											value={fromEmail}
											onChange={(e) => setFromEmail(e.target.value)}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Email of the sender.
										</p>
									</div>
								</div>

								<div className='mb-6 flex space-x-6'>
									<div className='flex-1'>
										<label htmlFor='editHost' className='required-input-label'>
											SMTP Host
										</label>
										<input
											className='w-full'
											type='text'
											name='editHost'
											id='editHost'
											placeholder='Enter host'
											required
											value={host}
											onChange={(e) => setHost(e.target.value)}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Outgoing mail client server.
										</p>
									</div>

									<div className='flex-1'>
										<label htmlFor='editPort' className='required-input-label'>
											SMTP Port
										</label>
										<input
											className='w-full'
											type='text'
											name='editPort'
											id='editPort'
											placeholder='Enter port number'
											required
											value={port}
											onChange={(e) => setPort(Number(e.target.value))}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Default port for the SMTP is 465.
										</p>
									</div>
								</div>

								<div className='flex space-x-6'>
									<div className='flex-1'>
										<label
											htmlFor='editUsername'
											className='required-input-label'
										>
											SMTP Username
										</label>
										<input
											className='w-full'
											type='text'
											name='editUsername'
											id='editUsername'
											placeholder='Enter username'
											required
											value={username}
											onChange={(e) => setUsername(e.target.value)}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Username for the mail client server.
										</p>
									</div>

									<div className='flex-1'>
										<label
											htmlFor='editPassword'
											className='required-input-label'
										>
											SMTP Password
										</label>
										<div className='relative'>
											<input
												className='w-full pr-10'
												type='password'
												name='editPassword'
												id='editPassword'
												placeholder='Enter password'
												required
												value={password}
												onChange={(e) => {
													setPassword(e.target.value)
												}}
											/>
											<ViewPasswordToggle fieldId='editPassword' />
										</div>
										<p className='mt-2 text-xs text-gray-400'>
											Password for the mail client server.
										</p>
									</div>
								</div>

								<div className='mt-9 flex items-center justify-end'>
									<span
										className='mr-auto cursor-pointer self-end text-sm font-medium text-indigo-600 transition hover:text-indigo-700'
										onClick={() => setOpenSendTestEmailModal(true)}
									>
										Send Test Email?
									</span>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button
										className='ml-6 w-40'
										type='submit'
										disabled={!allowed}
									>
										Update
									</button>
								</div>
							</form>
						</>
					)}
				</div>
			</div>

			{openSendTestEmailModal && (
				<SendTestEmailModal
					emailConfig={{
						FROM_NAME: fromName,
						FROM_EMAIL: fromEmail,
						EMAIL_HOST: host,
						EMAIL_PORT: port,
						EMAIL_USERNAME: username,
						EMAIL_PASSWORD: password,
					}}
					openModal={openSendTestEmailModal}
					setOpenModal={setOpenSendTestEmailModal}
				/>
			)}
		</Dialog>
	)
}

export default EditEmailConfigModal
