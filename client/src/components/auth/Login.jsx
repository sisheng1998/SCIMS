import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (localStorage.getItem('accessToken')) {
			navigate('/')
		}
	}, [navigate])

	const loginHandler = async (e) => {
		e.preventDefault()

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			const { data } = await axios.post(
				'/api/auth/login',
				{ email, password },
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
			<h1 className='my-6 text-center'>Welcome Back!</h1>

			<div className='auth-card'>
				{error && <span>{error}</span>}
				<form onSubmit={loginHandler}>
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
						placeholder='Enter your password'
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<input type='checkbox' id='rememberMe' />
							<label className='mb-0 ml-2 inline' htmlFor='rememberMe'>
								Remember me
							</label>
						</div>

						<p className='text-right text-sm'>
							<Link to='/forgot-password'>Forgot password?</Link>
						</p>
					</div>

					<button className='mt-6 w-full' type='submit'>
						Login
					</button>
				</form>
			</div>

			<p className='mt-6'>
				Don't have an account? <Link to='/register'>Register</Link>
			</p>
		</>
	)
}

export default Login
