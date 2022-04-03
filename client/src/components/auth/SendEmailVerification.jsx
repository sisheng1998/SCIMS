import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'

const SendEmailVerification = () => {
	const navigate = useNavigate()

	const { state } = useLocation()
	const { email } = state || {}

	useEffect(() => {
		if (!state) {
			navigate('/login')
		}
	}, [state, navigate])

	const [success, setSuccess] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const sendEmailHandler = async () => {
		setErrorMessage('')

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			await axios.put('/api/auth/verify-email', { email }, config)
			setSuccess(true)
		} catch (error) {
			setErrorMessage('Oops. Something went wrong. Please try again later.')
		}
	}

	return (
		<>
			<div className='auth-card mt-8 text-center'>
				{success ? (
					<>
						<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
						<h2 className='mt-6 mb-2 text-green-600'>Email Sent!</h2>
						<p>An email with verification link has been sent.</p>
						<p className='mt-6'>The email has been sent to:</p>
						<p className='text-lg font-semibold'>
							{email ? email : 'Your Registered Email Address'}
						</p>
						<p className='mt-6'>
							Kindly check your email and click on the verification link
							provided to verify your email.
						</p>
					</>
				) : (
					<>
						{errorMessage && (
							<p className='mb-6 flex items-center text-left text-sm font-medium text-red-600'>
								<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
								{errorMessage}
							</p>
						)}
						<XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
						<h2 className='mt-6 mb-2 text-red-600'>Email Not Verified!</h2>
						<p>Your email hasn't been verified yet.</p>
						<p className='my-6'>
							Kindly check your email and click on the verification link to
							verify your email.
						</p>

						<p className='text-sm'>
							Didn't receive any email?
							<br />
							<span
								onClick={sendEmailHandler}
								className='cursor-pointer font-semibold text-indigo-600 transition hover:text-indigo-700'
							>
								Resend Verification Email
							</span>{' '}
							or{' '}
							<span
								onClick={() =>
									navigate('/change-email', { state: { email: email } })
								}
								className='cursor-pointer font-semibold text-indigo-600 transition hover:text-indigo-700'
							>
								Change Email
							</span>
						</p>
					</>
				)}
			</div>
			<p className='mt-6'>
				Return to <Link to='/login'>Login</Link>
			</p>
		</>
	)
}

export default SendEmailVerification
