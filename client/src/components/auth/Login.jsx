import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import USMEmailField from '../validations/USMEmailField'
import LoginPasswordField from '../validations/LoginPasswordField'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

const Login = () => {
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [emailValidated, setEmailValidated] = useState(false)
	const [passwordValidated, setPasswordValidated] = useState(false)

	const [errorMessage, setErrorMessage] = useState('')

	const [allowed, setAllowed] = useState(false)

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
			if (error.response?.status === 401) {
				setErrorMessage('Incorrect email or password.')
			} else if (error.response?.status === 403) {
				navigate('/verify-email', { state: { email: email } })
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
			setTimeout(() => {
				setErrorMessage('')
			}, 5000)
		}
	}

	useEffect(() => {
		setAllowed(emailValidated && passwordValidated)
	}, [passwordValidated, emailValidated])

	return (
		<>
			<h1 className='my-6 text-center'>Welcome Back!</h1>

			<div className='auth-card'>
				{errorMessage && (
					<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
						<ExclamationCircleIcon className='mr-1 h-5 w-5 shrink-0' />{' '}
						{errorMessage}
					</p>
				)}

				<form onSubmit={loginHandler} spellCheck='false' autoComplete='off'>
					<label htmlFor='email' className='required-input-label'>
						Email Address
					</label>
					<USMEmailField
						message='Only *@usm.my or *.usm.my are allowed.'
						successMessage='Looks good!'
						checkExist={false}
						value={email}
						setValue={setEmail}
						validated={emailValidated}
						setValidated={setEmailValidated}
					/>

					<label htmlFor='password' className='required-input-label'>
						Password
					</label>
					<LoginPasswordField
						password={password}
						setPassword={setPassword}
						validated={passwordValidated}
						setValidated={setPasswordValidated}
					/>

					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<input type='checkbox' id='rememberMe' />
							<label className='mb-0 ml-2 inline' htmlFor='rememberMe'>
								Remember me
							</label>
						</div>

						<Link className='text-sm' to='/forgot-password'>
							Forgot password?
						</Link>
					</div>

					<button className='mt-6 w-full' type='submit' disabled={!allowed}>
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
