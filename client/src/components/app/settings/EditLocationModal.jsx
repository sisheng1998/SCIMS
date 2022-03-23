import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import NameField from '../../validations/NameField'

const EditLocationModal = ({
	location,
	openModal,
	setOpenModal,
	setEditLocationSuccess,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const labId = auth.currentLabId
	const locationId = location._id
	const [name, setName] = useState(location.name)

	const [nameValidated, setNameValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [isRemove, setIsRemove] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const editLocationHandler = async (e) => {
		e.preventDefault()

		if (isRemove) {
			try {
				await axiosPrivate.delete('/api/private/location', {
					data: {
						labId,
						locationId,
					},
				})
				setSuccess(true)
			} catch (error) {
				if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				} else {
					setErrorMessage('Oops. Something went wrong. Please try again later.')
				}
			}
		} else {
			try {
				await axiosPrivate.put('/api/private/location', {
					labId,
					locationId,
					name,
				})
				setSuccess(true)
			} catch (error) {
				if (error.response?.status === 409) {
					setErrorMessage('The location already exists.')
				} else if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				} else {
					setErrorMessage('Oops. Something went wrong. Please try again later.')
				}
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
		setAllowed(nameValidated && name !== location.name)
	}, [location, name, nameValidated])

	const closeHandler = () => {
		setErrorMessage('')
		setName('')
		setIsRemove(false)

		if (success) {
			setSuccess(false)
			setEditLocationSuccess(true)
		}

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
				<div
					className={`relative w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>
								Location {isRemove ? 'Removed' : 'Updated'}!
							</h2>
							{isRemove ? (
								<p>The location has been removed.</p>
							) : (
								<p>The location have been updated.</p>
							)}
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
								<h4>Edit Location</h4>
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
								onSubmit={editLocationHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<label htmlFor='location' className='required-input-label'>
									Location Name
								</label>
								<NameField
									id='location'
									placeholder='Enter location name (e.g Cabinet A)'
									required={true}
									value={name}
									setValue={setName}
									validated={nameValidated}
									setValidated={setNameValidated}
								/>

								{isRemove ? (
									<div className='mt-9 flex items-center justify-end'>
										<div className='mr-auto'>
											<p className='font-medium text-gray-900'>
												Confirm remove location?
											</p>
											<p className='mt-1 flex items-center text-sm font-medium text-red-600'>
												<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />
												This action is irreversible!
											</p>
										</div>
										<span
											onClick={() => setIsRemove(false)}
											className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
										>
											Cancel
										</span>
										<button className='button-red ml-6 w-40' type='submit'>
											Remove
										</button>
									</div>
								) : (
									<div className='mt-9 flex items-center justify-end'>
										<span
											onClick={() => setIsRemove(true)}
											className='mr-auto cursor-pointer self-end text-sm font-medium text-red-600 transition hover:text-red-700'
										>
											Remove Location
										</span>
										<span
											onClick={closeHandler}
											className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
										>
											Cancel
										</span>
										<button className='w-40' type='submit' disabled={!allowed}>
											Update
										</button>
									</div>
								)}
							</form>
						</>
					)}
				</div>
			</div>
		</Dialog>
	)
}

export default EditLocationModal
