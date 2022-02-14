import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import StrongPasswordField from '../validations/StrongPasswordField'
import { ExclamationCircleIcon, CheckIcon } from '@heroicons/react/outline'

const ResetPassword = () => {
	const params = useParams()

	const [password, setPassword] = useState('')
	const [passwordValidated, setPasswordValidated] = useState(false)

	const [errorMessage, setErrorMessage] = useState('')
	const [success, setSuccess] = useState(false)

	const resetPasswordHandler = async (e) => {
		e.preventDefault()

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			await axios.put(
				`/api/auth/reset-password/${params.resetToken}`,
				{ password },
				config
			)

			setSuccess(true)
		} catch (error) {
			setErrorMessage('Reset password link expired. Kindly request again.')
		}
	}

	useEffect(() => {
		setErrorMessage('')
	}, [password])

	return (
		<>
			{success ? (
				<div className='auth-card mt-8 text-center'>
					<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
					<h2 className='mt-6 mb-2 text-green-600'>Password Changed!</h2>
					<p>Your password has been changed successfully.</p>

					<Link to='/login'>
						<button className='mt-9 w-full'>Login</button>
					</Link>
				</div>
			) : (
				<>
					<h1 className='my-6 text-center'>Reset Your Password</h1>

					<div className='auth-card'>
						{errorMessage && (
							<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
								<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
								{errorMessage}
							</p>
						)}

						<form onSubmit={resetPasswordHandler}>
							<StrongPasswordField
								password={password}
								setPassword={setPassword}
								setValidated={setPasswordValidated}
							/>

							<button
								className='mt-3 w-full'
								type='submit'
								disabled={!passwordValidated}
							>
								Reset Password
							</button>
						</form>
					</div>

					<p className='mt-6'>
						Return to <Link to='/login'>Login</Link>
					</p>
				</>
			)}
		</>
	)
}

export default ResetPassword
