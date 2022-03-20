import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import USMEmailField from '../../validations/USMEmailField'
import useLogout from '../../../hooks/useLogout'

const ChangePasswordModal = ({ user, openModal, setOpenModal }) => {
	const axiosPrivate = useAxiosPrivate()
	const logout = useLogout()

	const [email, setEmail] = useState(user.email)
	const [USMEmailValidated, setUSMEmailValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const submitHandler = async (e) => {
		e.preventDefault()

		try {
			await axiosPrivate.post('/api/private/profile/email', {
				email,
			})
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 409) {
				setErrorMessage('An account with this email already exists.')
			} else if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
		setAllowed(USMEmailValidated && email !== user.email)
	}, [user, email, USMEmailValidated])

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			logout()
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
					className={`relative w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>Email Changed!</h2>
							<p>Your email has been changed.</p>
							<p className='mt-6 flex items-center justify-center text-sm font-medium text-red-600'>
								<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />
								Kindly verify and re-login with your new email.
							</p>
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Logout
							</button>
						</>
					) : (
						<>
							<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
								<h4>Change Email</h4>
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
								onSubmit={submitHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<label htmlFor='email' className='required-input-label'>
									Email Address
								</label>
								<USMEmailField
									message='Only *@usm.my or *.usm.my are allowed.'
									checkExist={false}
									value={email}
									setValue={setEmail}
									validated={USMEmailValidated}
									setValidated={setUSMEmailValidated}
								/>

								<p className='mb-6 flex items-center text-xs font-medium text-indigo-600'>
									<ExclamationCircleIcon className='mr-1.5 h-4 w-4 shrink-0 stroke-2' />
									A verification email will be sent to your new email address
									after the email changed.
								</p>

								<div className='flex items-center justify-end'>
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
										Change
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

export default ChangePasswordModal
