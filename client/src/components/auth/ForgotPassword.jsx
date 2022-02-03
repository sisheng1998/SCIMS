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
		<div className='min-h-screen flex flex-col items-center justify-center p-6'>
			<img
				className='h-12 mx-auto'
				src='/scims-logo.svg'
				alt='SCIMS Logo'
				draggable='false'
			/>
			<h1 className='text-gray-900 text-center text-4xl font-medium my-6'>
				Forgot Password?
			</h1>

			<div className='bg-white p-8 w-full max-w-md shadow rounded-lg'>
				{error && <span>{error}</span>}
				{success && <span>{success}</span>}
				<form onSubmit={forgotPasswordHandler}>
					<p className='text-gray-700 mb-6'>
						Please enter the email address you register your account with.
						<br />
						We will send you reset password confirmation to this email.
					</p>
					<label
						className='block text-gray-700 text-sm font-medium mb-2'
						htmlFor='email'
					>
						Email Address
					</label>
					<input
						className='border-gray-300 w-full mb-6 shadow rounded-lg'
						type='email'
						id='email'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<button
						className='bg-indigo-600 text-white text-center text-xl font-medium tracking-wide w-full p-3 mt-2 rounded-lg transition hover:bg-indigo-700'
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
