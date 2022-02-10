import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import LabSelectionField from '../validations/LabSelectionField'
import NameField from '../validations/NameField'
import USMEmailField from '../validations/USMEmailField'
import EmailField from '../validations/EmailField'
import StrongPasswordField from '../validations/StrongPasswordField'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'

const Register = () => {
	const navigate = useNavigate()

	const [name, setName] = useState('')
	const [lab, setLab] = useState('')
	const [email, setEmail] = useState('')
	const [altEmail, setAltEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const [allowed, setAllowed] = useState(false)
	const [labValidated, setLabValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)
	const [USMEmailValidated, setUSMEmailValidated] = useState(false)
	const [emailValidated, setEmailValidated] = useState(false)
	const [passwordValidated, setPasswordValidated] = useState(false)
	const [nextStep, setNextStep] = useState(false)
	const [allowNextStep, setAllowNextStep] = useState(false)

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

	useEffect(() => {
		setAllowNextStep(USMEmailValidated && passwordValidated)

		setAllowed(
			labValidated &&
				nameValidated &&
				USMEmailValidated &&
				emailValidated &&
				passwordValidated
		)
	}, [
		labValidated,
		nameValidated,
		USMEmailValidated,
		emailValidated,
		passwordValidated,
	])

	return (
		<>
			<h1 className='my-6 text-center'>Create New Account</h1>

			<div className='auth-card'>
				{error && <span>{error}</span>}

				<form onSubmit={registerHandler} spellCheck='false' autoComplete='off'>
					<div className={!nextStep ? 'block' : 'hidden'}>
						<label htmlFor='email' className='required-input-label'>
							Email Address
						</label>
						<USMEmailField
							message='Only *@usm.my or *.usm.my are allowed. (Used for Login)'
							value={email}
							setValue={setEmail}
							validated={USMEmailValidated}
							setValidated={setUSMEmailValidated}
						/>

						<StrongPasswordField
							password={password}
							setPassword={setPassword}
							setValidated={setPasswordValidated}
						/>

						<p
							onClick={() => setNextStep(true)}
							className={`mt-6 flex items-center justify-end font-semibold text-indigo-600 hover:text-indigo-700 ${
								allowNextStep
									? 'cursor-pointer'
									: 'pointer-events-none opacity-50'
							}`}
						>
							Next
							<ArrowRightIcon className='ml-1 h-4 w-4' />
						</p>
					</div>

					<div className={nextStep ? 'block' : 'hidden'}>
						<p
							onClick={() => setNextStep(false)}
							className='mb-6 flex cursor-pointer items-center justify-start font-semibold text-indigo-600 hover:text-indigo-700'
						>
							<ArrowLeftIcon className='mr-1 h-4 w-4' />
							Previous
						</p>

						<label htmlFor='name' className='required-input-label'>
							Name
						</label>
						<NameField
							id='name'
							placeholder='Enter your name'
							required={true}
							value={name}
							setValue={setName}
							validated={nameValidated}
							setValidated={setNameValidated}
						/>

						<label htmlFor='altEmail' className='required-input-label'>
							Alternative Email Address
						</label>
						<EmailField
							id='altEmail'
							placeholder='Enter your email'
							message='Personal email is recommended. (Not used for login)'
							value={altEmail}
							setValue={setAltEmail}
							validated={emailValidated}
							setValidated={setEmailValidated}
						/>

						<label htmlFor='labSelection' className='required-input-label'>
							Lab
						</label>
						<LabSelectionField
							value={lab}
							setValue={setLab}
							validated={labValidated}
							setValidated={setLabValidated}
						/>

						<button className='mt-6 w-full' type='submit' disabled={!allowed}>
							Register
						</button>
					</div>
				</form>
			</div>

			<p className='mt-6'>
				Already have an account? <Link to='/login'>Login</Link>
			</p>
		</>
	)
}

export default Register
