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
		<>
			<h1 className='my-6 text-center'>Create New Account</h1>

			<div className='auth-card'>
				{error && <span>{error}</span>}
				<form onSubmit={registerHandler}>
					<label htmlFor='name'>Name</label>
					<input
						className='mb-6 w-full'
						type='text'
						id='name'
						placeholder='Enter your name'
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

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
						Register
					</button>
				</form>
			</div>

			<p className='mt-6'>
				Already have an account? <Link to='/login'>Login</Link>
			</p>
		</>
	)
}

export default Register
