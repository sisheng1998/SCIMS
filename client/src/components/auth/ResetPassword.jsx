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
		<>
			<h1 className='my-6 text-center'>Reset Password</h1>

			<div className='auth-card'>
				{error && <span>{error}</span>}
				{success && <span>{success}</span>}
				<form onSubmit={resetPasswordHandler}>
					<label htmlFor='password'>Password</label>
					<input
						className='mb-6 w-full'
						type='password'
						id='password'
						placeholder='Enter a new password'
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<label htmlFor='confirmPassword'>Confirm Password</label>
					<input
						className='mb-6 w-full'
						type='password'
						id='confirmPassword'
						placeholder='Retype the new password'
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>

					<button className='w-full' type='submit'>
						Reset
					</button>
				</form>
			</div>
		</>
	)
}

export default ResetPassword
