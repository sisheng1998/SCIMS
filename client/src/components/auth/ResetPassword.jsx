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
		<div className='min-h-screen flex flex-col items-center justify-center p-6'>
			<img
				className='h-12 mx-auto'
				src='/scims-logo.svg'
				alt='SCIMS Logo'
				draggable='false'
			/>
			<h1 className='text-gray-900 text-center text-4xl font-medium my-6'>
				Reset Password
			</h1>

			<div className='bg-white p-8 w-full max-w-md shadow rounded-lg'>
				{error && <span>{error}</span>}
				{success && <span>{success}</span>}
				<form onSubmit={resetPasswordHandler}>
					<label
						className='block text-gray-700 text-sm font-medium mb-2'
						htmlFor='password'
					>
						Password
					</label>
					<input
						className='border-gray-300 w-full mb-6 shadow rounded-lg'
						type='password'
						id='password'
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<label
						className='block text-gray-700 text-sm font-medium mb-2'
						htmlFor='confirmPassword'
					>
						Confirm Password
					</label>
					<input
						className='border-gray-300 w-full mb-6 shadow rounded-lg'
						type='password'
						id='confirmPassword'
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>

					<button
						className='bg-indigo-600 text-white text-center text-xl font-medium tracking-wide w-full p-3 mt-2 rounded-lg transition hover:bg-indigo-700'
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
