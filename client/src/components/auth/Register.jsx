import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (localStorage.getItem('accessToken')) {
			navigate('/')
		}
	}, [navigate])

	const registerHandler = async (e) => {
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
			const { data } = await axios.post(
				'/api/auth/register',
				{ name, email, password },
				config
			)

			localStorage.setItem('accessToken', data.accessToken)

			navigate('/')
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
				Create New Account
			</h1>

			<div className='w-full max-w-md rounded-lg bg-white p-8 shadow'>
				{error && <span>{error}</span>}
				<form onSubmit={registerHandler}>
					<label
						className='mb-2 block text-sm font-medium text-gray-700'
						htmlFor='name'
					>
						Your Name
					</label>
					<input
						className='mb-6 w-full rounded-lg border-gray-300 shadow'
						type='text'
						id='name'
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

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
						Register
					</button>
				</form>
			</div>

			<p className='mt-6 text-gray-700'>
				Already have an account?{' '}
				<Link
					className='font-medium text-indigo-600 transition hover:text-indigo-700'
					to='/login'
				>
					Login
				</Link>
			</p>
		</div>
	)
}

export default Register
