import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import axios from 'axios'
import USMEmailField from '../../validations/USMEmailField'
import LoginPasswordField from '../../validations/LoginPasswordField'
import NameField from '../../validations/NameField'
import EmailField from '../../validations/EmailField'
import { XIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import PasswordGenerator from '../../others/PasswordGenerator'

const AddUserModal = ({ openModal, setOpenModal }) => {
	const { auth } = useAuth()

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
				if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				}
			}
		}

		fetchEmails()
	}, [])

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [altEmail, setAltEmail] = useState('')
	const labId = auth.currentLabId
	const labName = auth.currentLabName
	const [role, setRole] = useState(ROLES_LIST.viewer)

	const [USMEmailValidated, setUSMEmailValidated] = useState(false)
	const [passwordValidated, setPasswordValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)
	const [emailValidated, setEmailValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)

	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const registerHandler = async (e) => {
		e.preventDefault()

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			await axios.post(
				'/api/auth/register',
				{ name, email, altEmail, password, labId },
				config
			)
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 409) {
				setErrorMessage('An account with this email already exists.')
			} else if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
	}, [email, password, name, altEmail])

	useEffect(() => {
		setAllowed(
			USMEmailValidated && passwordValidated && nameValidated && emailValidated
		)
	}, [USMEmailValidated, passwordValidated, nameValidated, emailValidated])

	const closeHandler = () => {
		setEmail('')
		setPassword('')
		setName('')
		setAltEmail('')
		setRole(ROLES_LIST.viewer)
		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div className='relative w-full max-w-3xl rounded-lg bg-white p-6 shadow'>
					<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
						<h4>Add New User</h4>
						<XIcon
							className='h-5 w-5 cursor-pointer hover:text-indigo-600'
							onClick={closeHandler}
						/>
					</div>

					{errorMessage && (
						<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
							<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
							{errorMessage}
						</p>
					)}

					<form
						onSubmit={registerHandler}
						spellCheck='false'
						autoComplete='off'
					>
						<div className='flex'>
							<div className='mr-3 flex-1'>
								<label htmlFor='email' className='required-input-label'>
									Email Address
								</label>
								<USMEmailField
									placeholder='Enter USM email'
									message='Only *@usm.my or *.usm.my are allowed.'
									successMessage='Looks good.'
									checkExist={true}
									existingEmails={emails}
									value={email}
									setValue={setEmail}
									validated={USMEmailValidated}
									setValidated={setUSMEmailValidated}
								/>
							</div>

							<div className='ml-3 flex-1'>
								<div className='flex items-end justify-between'>
									<label htmlFor='password' className='required-input-label'>
										Password
									</label>
									<PasswordGenerator />
								</div>
								<LoginPasswordField
									placeholder='Enter strong password'
									password={password}
									setPassword={setPassword}
									validated={passwordValidated}
									setValidated={setPasswordValidated}
								/>
							</div>
						</div>

						<div className='flex'>
							<div className='mr-3 flex-1'>
								<label htmlFor='name' className='required-input-label'>
									Name
								</label>
								<NameField
									id='name'
									placeholder='Enter name'
									required={true}
									value={name}
									setValue={setName}
									validated={nameValidated}
									setValidated={setNameValidated}
								/>
							</div>

							<div className='ml-3 flex-1'>
								<label htmlFor='altEmail' className='required-input-label'>
									Alternative Email Address
								</label>
								<EmailField
									id='altEmail'
									placeholder='Enter email'
									message='Personal email is recommended.'
									value={altEmail}
									setValue={setAltEmail}
									validated={emailValidated}
									setValidated={setEmailValidated}
								/>
							</div>
						</div>

						<div className='mb-9 flex'>
							<div className='pointer-events-none mr-3 flex-1'>
								<label htmlFor='lab' className='required-input-label'>
									Current Lab
								</label>
								<input
									className='w-full'
									type='text'
									name='lab'
									id='lab'
									readOnly
									value={labName}
								/>
								<p className='mt-2 text-xs text-gray-400'>
									Current lab is chosen by default and it cannot be changed.
								</p>
							</div>

							<div className='ml-3 flex-1'>
								<label htmlFor='roleSelection' className='required-input-label'>
									Role
								</label>
								<select
									className='w-full'
									id='roleSelection'
									required
									value={role}
									onChange={(e) => setRole(e.target.value)}
								>
									<option value={ROLES_LIST.viewer}>Viewer</option>
									<option value={ROLES_LIST.undergraduate}>
										Undergraduate
									</option>
									<option value={ROLES_LIST.postgraduate}>Postgraduate</option>
								</select>
								<p className='mt-2 text-xs text-gray-400'>
									User role for the current lab.
								</p>
							</div>
						</div>

						<div className='flex items-center justify-end'>
							<span
								onClick={closeHandler}
								className='mr-6 cursor-pointer font-medium text-gray-500 hover:text-indigo-600'
							>
								Cancel
							</span>
							<button className='w-40' type='submit' disabled={!allowed}>
								Add User
							</button>
						</div>
					</form>
				</div>
			</div>
		</Dialog>
	)
}

export default AddUserModal
