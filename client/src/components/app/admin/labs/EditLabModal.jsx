import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import UserSearchableSelect from '../../../others/SearchableSelect'
import LabNameField from '../../../validations/LabNameField'

const EditLabModal = ({
	lab,
	isEdit,
	openModal,
	setOpenModal,
	setEditLabSuccess,
	users,
}) => {
	const axiosPrivate = useAxiosPrivate()

	const labId = lab._id
	const [ownerId, setOwnerId] = useState(lab.labOwner._id)
	const [labName, setLabName] = useState(lab.labName)
	const [labNameValidated, setLabNameValidated] = useState(false)
	const [status, setStatus] = useState(lab.status)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [isRemove, setIsRemove] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const editLabHandler = async (e) => {
		e.preventDefault()

		if (isRemove) {
			try {
				await axiosPrivate.delete('/api/private/user', {
					data: {
						labId,
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
				await axiosPrivate.put('/api/admin/lab', {
					labId,
					ownerId,
					labName,
					status,
				})
				setSuccess(true)
			} catch (error) {
				if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				} else {
					setErrorMessage('Oops. Something went wrong. Please try again later.')
				}
			}
		}
	}

	useEffect(() => {
		setAllowed(
			labNameValidated &&
				(status !== lab.status ||
					ownerId !== lab.labOwner._id ||
					labName !== lab.labName)
		)
	}, [lab, ownerId, labName, labNameValidated, status])

	const closeHandler = () => {
		setErrorMessage('')
		setIsRemove(false)

		if (success) {
			setSuccess(false)
			setEditLabSuccess(true)
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
					className={`relative w-full  rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-3xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>
								Lab {isRemove ? 'Removed' : 'Info Updated'}!
							</h2>
							{isRemove ? (
								<p>The lab has been removed.</p>
							) : (
								<p>The lab information has been updated.</p>
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
								<h4>{isEdit ? 'Edit' : 'View'} Lab Information</h4>
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
								onSubmit={editLabHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<div className='mb-6'>
									<label
										htmlFor='userSelection'
										className={isEdit ? 'required-input-label' : undefined}
									>
										Lab Owner (Name / Email)
									</label>
									<UserSearchableSelect
										readOnly={!isEdit}
										selectedId={ownerId}
										setSelectedId={setOwnerId}
										options={users}
									/>
									{isEdit ? (
										<p className='mt-2 text-xs text-gray-400'>
											Lab owner for the current lab.
										</p>
									) : null}
								</div>

								<div className='mb-6 flex'>
									<div className='mr-3 flex-1'>
										<label
											htmlFor='labName'
											className={isEdit ? 'required-input-label' : undefined}
										>
											Lab Name
										</label>
										{isEdit ? (
											<>
												<LabNameField
													value={labName}
													setValue={setLabName}
													validated={labNameValidated}
													setValidated={setLabNameValidated}
												/>
												{labNameValidated ? (
													<p className='mt-2 text-xs text-gray-400'>
														Name of the current lab.
													</p>
												) : (
													<p className='mt-2 text-xs text-red-600'>
														Please enter a valid lab name.
													</p>
												)}
											</>
										) : (
											<input
												className='w-full'
												type='text'
												name='labName'
												id='labName'
												readOnly
												value={labName}
											/>
										)}
									</div>

									<div className='ml-3 flex-1'>
										<label
											htmlFor='statusSelection'
											className={isEdit ? 'required-input-label' : undefined}
										>
											Status
										</label>
										{isEdit ? (
											<>
												<select
													className='w-full'
													id='statusSelection'
													required
													value={status}
													onChange={(e) => setStatus(e.target.value)}
												>
													<option value='In Use'>In Use</option>
													<option value='Not In Use'>Not In Use</option>
												</select>
												<p className='mt-2 text-xs text-gray-400'>
													Status of the current lab.
												</p>
											</>
										) : (
											<input
												className='w-full'
												type='text'
												name='statusSelection'
												id='statusSelection'
												readOnly
												value={lab.status}
											/>
										)}
									</div>
								</div>

								<div className='mb-6 flex'>
									<div className='mr-3 flex-1'>
										<label htmlFor='numOfUsers'>Number of Users</label>
										<input
											className='w-full'
											type='number'
											name='numOfUsers'
											id='numOfUsers'
											readOnly
											value={lab.labUsers.length}
										/>
									</div>

									<div className='ml-3 flex-1'></div>
								</div>

								{isRemove ? (
									<div className='flex items-center justify-end'>
										<div className='mr-auto'>
											<p className='font-medium text-gray-900'>
												Confirm remove the current lab?
											</p>
											<p className='mt-1 flex items-center text-sm font-medium text-red-600'>
												<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
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
									<div className='flex items-center justify-end'>
										{isEdit && (
											<span
												onClick={() => setIsRemove(true)}
												className='mr-auto cursor-pointer self-end text-sm font-medium text-red-600 transition hover:text-red-700'
											>
												Remove Lab
											</span>
										)}
										<span
											onClick={closeHandler}
											className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
										>
											{isEdit ? 'Cancel' : 'Close'}
										</span>
										{isEdit && (
											<button
												className='ml-6 w-40'
												type='submit'
												disabled={!allowed}
											>
												Update
											</button>
										)}
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

export default EditLabModal
