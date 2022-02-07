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
		<>
			<h1 className='my-6 text-center'>Forgot Password?</h1>

			<div className='auth-card'>
				{error && <span>{error}</span>}
				{success && <span>{success}</span>}
				<form onSubmit={forgotPasswordHandler}>
					<p className='mb-6 text-gray-700'>
						Please enter the email address you register your account with.
						<br />
						We will send you reset password confirmation to this email.
					</p>

					<label htmlFor='email'>Email Address</label>
					<input
						className='mb-6 w-full'
						type='email'
						id='email'
						placeholder='Enter your email'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<button className='w-full' type='submit'>
						Send
					</button>
				</form>
			</div>
		</>
	)
}

export default ForgotPassword
