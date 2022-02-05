import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const ForgotPassword = () => {
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const forgotPasswordHandler = async (e) => {
		e.preventDefault()

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			const { data } = await axios.post(
				'/api/auth/forgot-password',
				{ email },
				config
			)

			setSuccess(data.data)
		} catch (error) {
			setError(error.response.data.error)
			setEmail('')
			setTimeout(() => {
				setError('')
			}, 5000)
		}
	}

	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-6'>
			<img
				className='mx-auto h-12'
				src='/scims-logo.svg'
				alt='SCIMS Logo'
				draggable='false'
			/>
			<h1 className='my-6 text-center text-4xl font-medium text-gray-900'>
				Forgot Password?
			</h1>

			<div className='w-full max-w-md rounded-lg bg-white p-8 shadow'>
				{error && <span>{error}</span>}
				{success && <span>{success}</span>}
				<form onSubmit={forgotPasswordHandler}>
					<p className='mb-6 text-gray-700'>
						Please enter the email address you register your account with.
						<br />
						We will send you reset password confirmation to this email.
					</p>
					<label
						className='mb-2 block text-sm font-medium text-gray-700'
						htmlFor='email'
					>
						Email Address
					</label>
					<input
						className='mb-6 w-full rounded-lg border-gray-300 shadow'
						type='email'
						id='email'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<button
						className='mt-2 w-full rounded-lg bg-indigo-600 p-3 text-center text-xl font-medium tracking-wide text-white transition hover:bg-indigo-700'
						type='submit'
					>
						Send
					</button>
				</form>
			</div>
		</div>
	)
}

export default ForgotPassword
