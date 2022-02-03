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
		if (localStorage.getItem('authToken')) {
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

			localStorage.setItem('authToken', data.token)

			navigate('/')
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
				Create New Account
			</h1>

			<div className='bg-white p-8 w-full max-w-md shadow rounded-lg'>
				{error && <span>{error}</span>}
				<form onSubmit={registerHandler}>
					<label
						className='block text-gray-700 text-sm font-medium mb-2'
						htmlFor='name'
					>
						Your Name
					</label>
					<input
						className='border-gray-300 w-full mb-6 shadow rounded-lg'
						type='text'
						id='name'
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

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
						Register
					</button>
				</form>
			</div>

			<p className='text-gray-700 mt-6'>
				Already have an account?{' '}
				<Link
					className='font-medium transition text-indigo-600 hover:text-indigo-700'
					to='/login'
				>
					Login
				</Link>
			</p>
		</div>
	)
}

export default Register
