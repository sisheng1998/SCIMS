import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import MatricNoField from '../../validations/MatricNoField'
import NameField from '../../validations/NameField'
import AltEmailField from '../../validations/AltEmailField'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const EditPersonalInfoModal = ({
	user,
	openModal,
	setOpenModal,
	setEditPersonalInfoSuccess,
}) => {
	const axiosPrivate = useAxiosPrivate()
	const divRef = useRef(null)

	const [matricNo, setMatricNo] = useState(user.matricNo)
	const [name, setName] = useState(user.name)
	const [altEmail, setAltEmail] = useState(user.altEmail || '')

	const [matricNoValidated, setMatricNoValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)
	const [altEmailValidated, setAltEmailValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const submitHandler = async (e) => {
		e.preventDefault()

		try {
			await axiosPrivate.post('/api/private/profile', {
				matricNo,
				name,
				altEmail,
			})
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 409) {
				setErrorMessage(
					'A user with this matric number or staff number already exists.'
				)
			} else if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
		setAllowed(
			matricNoValidated &&
				nameValidated &&
				altEmailValidated &&
				(matricNo !== user.matricNo ||
					name !== user.name ||
					altEmail !== user.altEmail)
		)
	}, [
		user,
		matricNo,
		name,
		altEmail,
		matricNoValidated,
		nameValidated,
		altEmailValidated,
	])

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			setSuccess(false)
			setEditPersonalInfoSuccess(true)
		}

		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			initialFocus={divRef}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div
				ref={divRef}
				className='flex min-h-screen items-center justify-center'
			>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>
								Personal Info Updated!
							</h2>
							<p>Your personal info has been updated.</p>
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
								<h4>Edit Personal Info</h4>
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
								onSubmit={submitHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<label htmlFor='matricNo' className='required-input-label'>
									Matric/Staff Number
								</label>
								<MatricNoField
									placeholder='Enter your matric/staff number'
									value={matricNo}
									setValue={setMatricNo}
									validated={matricNoValidated}
									setValidated={setMatricNoValidated}
								/>

								<label htmlFor='name' className='required-input-label'>
									Full Name{' '}
									<span className='text-xs'>(as per IC/Passport)</span>
								</label>
								<NameField
									id='name'
									placeholder='Enter your full name'
									required={true}
									value={name}
									setValue={setName}
									validated={nameValidated}
									setValidated={setNameValidated}
								/>

								<AltEmailField
									value={altEmail}
									setValue={setAltEmail}
									validated={altEmailValidated}
									setValidated={setAltEmailValidated}
								/>

								<div className='mt-9 flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button
										className='ml-6 w-40 lg:w-32'
										type='submit'
										disabled={!allowed}
									>
										Update
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

export default EditPersonalInfoModal
