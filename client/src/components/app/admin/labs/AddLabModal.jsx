import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import USMEmailField from '../../../validations/USMEmailField'
import LoginPasswordField from '../../../validations/LoginPasswordField'
import NameField from '../../../validations/NameField'
import EmailField from '../../../validations/EmailField'
import UserSearchableSelect from '../../../others/SearchableSelect'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import PasswordGenerator from '../../../others/PasswordGenerator'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LabNameField from '../../../validations/LabNameField'
import useAuth from '../../../../hooks/useAuth'

const AddLabModal = ({ users, openModal, setOpenModal, setAddLabSuccess }) => {
	const axiosPrivate = useAxiosPrivate()
	const { auth } = useAuth()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [altEmail, setAltEmail] = useState('')
	const [ownerId, setOwnerId] = useState('')
	const [labName, setLabName] = useState('')

	const [labNameValidated, setLabNameValidated] = useState(false)
	const [USMEmailValidated, setUSMEmailValidated] = useState(false)
	const [passwordValidated, setPasswordValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)
	const [emailValidated, setEmailValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [selectUser, setSelectUser] = useState(true)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const addLabHandler = async (e) => {
		e.preventDefault()

		try {
			if (selectUser) {
				await axiosPrivate.post('/api/admin/lab-existing-user', {
					ownerId,
					labName,
				})
			} else {
				await axiosPrivate.post('/api/admin/lab', {
					name,
					email,
					altEmail,
					password,
					labName,
				})
			}
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 409) {
				if (
					error.response.data.error === 'Alternative email address existed.'
				) {
					setErrorMessage(
						'An account with this alternative email already exists.'
					)
				} else if (error.response.data.error === 'Lab name existed.') {
					setErrorMessage('A lab with this name already exists.')
				} else {
					setErrorMessage('An account with this email already exists.')
				}
			} else if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
	}, [email, password, name, altEmail, ownerId, labName])

	useEffect(() => {
		if (selectUser) {
			setAllowed(ownerId !== '' && labNameValidated)
		} else {
			setAllowed(
				USMEmailValidated &&
					passwordValidated &&
					nameValidated &&
					emailValidated &&
					labNameValidated
			)
		}
	}, [
		USMEmailValidated,
		passwordValidated,
		nameValidated,
		emailValidated,
		selectUser,
		ownerId,
		labNameValidated,
	])

	const resetInputField = () => {
		setEmail('')
		setPassword('')
		setName('')
		setAltEmail('')
		setOwnerId('')
		setLabName('')
	}

	const closeHandler = () => {
		resetInputField()
		setSelectUser(true)

		if (success) {
			if (ownerId === auth.id) {
				window.location.reload(false)
			} else {
				setSuccess(false)
				setAddLabSuccess(true)
			}
		}

		setOpenModal(false)
	}

	const selectUserHandler = () => {
		resetInputField()
		setSelectUser(!selectUser)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-3xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>New Lab Added!</h2>
							<p>The new lab have been added.</p>
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Okay
							</button>
						</>
					) : (
						<>
							<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
								<h4>Add New Lab</h4>
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
								onSubmit={addLabHandler}
								spellCheck='false'
								autoComplete='off'
							>
								{selectUser ? (
									<div className='mb-6'>
										<label
											htmlFor='userSelection'
											className='required-input-label'
										>
											Lab Owner (Name / Email)
										</label>
										<UserSearchableSelect
											selectedId={ownerId}
											setSelectedId={setOwnerId}
											options={users}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Lab owner for the new lab.
										</p>
									</div>
								) : (
									<>
										<div className='flex'>
											<div className='mr-3 flex-1'>
												<label htmlFor='email' className='required-input-label'>
													Email Address
												</label>
												<USMEmailField
													placeholder='Enter USM email'
													message='Only *@usm.my or *.usm.my (except student email) are allowed.'
													successMessage='Looks good!'
													checkExist={false}
													value={email}
													setValue={setEmail}
													validated={USMEmailValidated}
													setValidated={setUSMEmailValidated}
													excludeStudent={true}
												/>
											</div>

											<div className='ml-3 flex-1'>
												<div className='flex items-end justify-between'>
													<label
														htmlFor='password'
														className='required-input-label'
													>
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
													Full Name{' '}
													<span className='text-xs'>(as per IC/Passport)</span>
												</label>
												<NameField
													id='name'
													placeholder='Enter full name'
													required={true}
													value={name}
													setValue={setName}
													validated={nameValidated}
													setValidated={setNameValidated}
												/>
											</div>

											<div className='ml-3 flex-1'>
												<label
													htmlFor='altEmail'
													className='required-input-label'
												>
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
									</>
								)}

								<div className='mb-9 flex'>
									<div className='mr-3 flex-1'>
										<label htmlFor='labName' className='required-input-label'>
											Lab Name
										</label>
										<LabNameField
											value={labName}
											setValue={setLabName}
											validated={labNameValidated}
											setValidated={setLabNameValidated}
											showValidated={true}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											{!labName ? (
												'Name of the new lab.'
											) : labNameValidated ? (
												<span className='text-green-600'>Looks good!</span>
											) : (
												<span className='text-red-600'>
													Please enter a valid lab name.
												</span>
											)}
										</p>
									</div>

									<div className='ml-3 flex-1'>
										<label htmlFor='role'>Role</label>
										<input
											className='w-full'
											type='text'
											name='role'
											id='role'
											readOnly
											value='Lab Owner'
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Role cannot be changed.
										</p>
									</div>
								</div>

								<div className='flex items-center justify-end'>
									<span
										onClick={selectUserHandler}
										className='mr-auto cursor-pointer self-end text-sm font-medium text-indigo-600 transition hover:text-indigo-700'
									>
										{selectUser ? 'Create New User' : 'Select Existing User'}
									</span>
									<span
										onClick={closeHandler}
										className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button className='w-40' type='submit' disabled={!allowed}>
										Add Lab
									</button>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</Dialog>
	)
}

export default AddLabModal