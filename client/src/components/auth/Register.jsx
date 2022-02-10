import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import USMEmailField from '../validations/USMEmailField'
import StrongPasswordField from '../validations/StrongPasswordField'
import NameField from '../validations/NameField'
import EmailField from '../validations/EmailField'
import LabSelectionField from '../validations/LabSelectionField'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'

const Register = () => {
	const [emails, setEmails] = useState([])

	useEffect(() => {
		const fetchEmails = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}

			try {
				const { data } = await axios.get('/api/auth/emails', config)
				setEmails(data.emails)
			} catch (error) {
				setEmails([])
			}
		}

		fetchEmails()
	}, [])

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [altEmail, setAltEmail] = useState('')
	const [labName, setLabName] = useState('')

	const [error, setError] = useState('')

	const [USMEmailValidated, setUSMEmailValidated] = useState(false)
	const [passwordValidated, setPasswordValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)
	const [emailValidated, setEmailValidated] = useState(false)
	const [labValidated, setLabValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [nextStep, setNextStep] = useState(false)
	const [allowNextStep, setAllowNextStep] = useState(false)

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
				{ name, email, altEmail, password, labName },
				config
			)
			setError(data.data)
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
			USMEmailValidated &&
				passwordValidated &&
				nameValidated &&
				emailValidated &&
				labValidated
		)
	}, [
		USMEmailValidated,
		passwordValidated,
		nameValidated,
		emailValidated,
		labValidated,
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
							successMessage='This email will be used for Login.'
							checkExist={true}
							existingEmails={emails}
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

						<div className='mt-6 text-right'>
							<p
								onClick={() => setNextStep(true)}
								className={`inline-flex items-center font-semibold text-indigo-600 transition hover:text-indigo-700 ${
									allowNextStep
										? 'cursor-pointer'
										: 'pointer-events-none opacity-50'
								}`}
							>
								Next
								<ArrowRightIcon className='ml-1 h-4 w-4' />
							</p>
						</div>
					</div>

					<div className={nextStep ? 'block' : 'hidden'}>
						<div className='mb-7'>
							<p
								onClick={() => setNextStep(false)}
								className='inline-flex cursor-pointer items-center font-semibold text-indigo-600 transition hover:text-indigo-700'
							>
								<ArrowLeftIcon className='mr-1 h-4 w-4' />
								Previous
							</p>
						</div>

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
							value={labName}
							setValue={setLabName}
							validated={labValidated}
							setValidated={setLabValidated}
						/>

						<button className='mt-3 w-full' type='submit' disabled={!allowed}>
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
