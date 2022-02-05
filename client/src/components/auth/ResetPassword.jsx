import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ResetPassword = () => {
	const params = useParams()
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const resetPasswordHandler = async (e) => {
		e.preventDefault()

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		if (password !== confirmPassword) {
			setPassword('')
			setConfirmPassword('')
			setTimeout(() => {
				setError('')
			}, 5000)
			return setError('Passwords do not match.')
		}

		try {
			const { data } = await axios.put(
				`/api/auth/reset-password/${params.resetToken}`,
				{ password },
				config
			)

			setSuccess(data.data)
		} catch (error) {
			setError(error.response.data.error)
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
				Reset Password
			</h1>

			<div className='w-full max-w-md rounded-lg bg-white p-8 shadow'>
				{error && <span>{error}</span>}
				{success && <span>{success}</span>}
				<form onSubmit={resetPasswordHandler}>
					<label
						className='mb-2 block text-sm font-medium text-gray-700'
						htmlFor='password'
					>
						Password
					</label>
					<input
						className='mb-6 w-full rounded-lg border-gray-300 shadow'
						type='password'
						id='password'
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<label
						className='mb-2 block text-sm font-medium text-gray-700'
						htmlFor='confirmPassword'
					>
						Confirm Password
					</label>
					<input
						className='mb-6 w-full rounded-lg border-gray-300 shadow'
						type='password'
						id='confirmPassword'
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>

					<button
						className='mt-2 w-full rounded-lg bg-indigo-600 p-3 text-center text-xl font-medium tracking-wide text-white transition hover:bg-indigo-700'
						type='submit'
					>
						Reset
					</button>
				</form>
			</div>
		</div>
	)
}

export default ResetPassword
