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
import StorageGroupsField from '../../validations/StorageGroupsField'

const AddLocationModal = ({
	openModal,
	setOpenModal,
	setAddLocationSuccess,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const labId = auth.currentLabId
	const [name, setName] = useState('')
	const [storageGroups, setStorageGroups] = useState([])
	const [nameValidated, setNameValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const addLocationHandler = async (e) => {
		e.preventDefault()

		try {
			await axiosPrivate.post('/api/private/location', {
				labId,
				name,
				storageGroups,
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

	useEffect(() => {
		setErrorMessage('')
		setAllowed(nameValidated && storageGroups.length !== 0)
	}, [name, nameValidated, storageGroups])

	const closeHandler = () => {
		setErrorMessage('')
		setName('')
		setStorageGroups([])

		if (success) {
			setSuccess(false)
			setAddLocationSuccess(true)
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
					className={`relative w-full rounded-lg bg-white p-6 shadow lg:m-4 ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>New Location Added!</h2>
							<p>The new location have been added.</p>
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
								<h4>Add New Location</h4>
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
								onSubmit={addLocationHandler}
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
									withNumber={true}
									showValidated={true}
								/>

								<label htmlFor='storageGroups' className='required-input-label'>
									Storage Group(s)
								</label>
								<StorageGroupsField
									value={storageGroups}
									setValue={setStorageGroups}
								/>

								<div className='mt-9 flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button className='w-40' type='submit' disabled={!allowed}>
										Add Location
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

export default AddLocationModal
