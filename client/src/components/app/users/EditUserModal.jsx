import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import FormatDate from '../../utils/FormatDate'
import StaticUserInfo from '../components/StaticUserInfo'

function getKeyByValue(value) {
	return Object.keys(ROLES_LIST).find((key) => ROLES_LIST[key] === value)
}

const EditUserModal = ({
	user,
	isEdit,
	openModal,
	setOpenModal,
	setEditUserSuccess,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const userId = user._id
	const labId = auth.currentLabId
	const [status, setStatus] = useState(user.status)
	const [role, setRole] = useState(getKeyByValue(user.roleValue))

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [isRemove, setIsRemove] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const editUserHandler = async (e) => {
		e.preventDefault()

		if (isRemove) {
			try {
				await axiosPrivate.delete('/api/private/user', {
					data: {
						userId,
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
				await axiosPrivate.put('/api/private/user', {
					userId,
					labId,
					status,
					role: ROLES_LIST[role],
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
		setAllowed(role !== getKeyByValue(user.roleValue) || status !== user.status)
	}, [user, role, status])

	const closeHandler = () => {
		setErrorMessage('')
		setIsRemove(false)

		if (success) {
			setSuccess(false)
			setEditUserSuccess(true)
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
						success ? 'max-w-sm text-center' : 'max-w-3xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>
								User {isRemove ? 'Removed' : 'Info Updated'}!
							</h2>
							{isRemove ? (
								<p>The user has been removed.</p>
							) : (
								<p>The user information has been updated.</p>
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
								<h4>{isEdit ? 'Edit' : 'View'} User Information</h4>
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
								onSubmit={editUserHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<StaticUserInfo user={user} />

								<div className='mb-6 flex space-x-6'>
									<div className='flex-1'>
										<label htmlFor='lab'>Current Lab</label>
										<input
											className='w-full'
											type='text'
											name='lab'
											id='lab'
											readOnly
											value={'Lab ' + auth.currentLabName}
										/>
										{isEdit && (
											<p className='mt-2 text-xs text-gray-400'>
												Current lab cannot be changed.
											</p>
										)}
									</div>

									<div className='flex-1'>
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
													<option value='Active'>Active</option>
													<option value='Deactivated'>Deactivated</option>
												</select>
												<p className='mt-2 text-xs text-gray-400'>
													User status for the current lab.
												</p>
											</>
										) : (
											<input
												className='w-full'
												type='text'
												name='statusSelection'
												id='statusSelection'
												readOnly
												value={
													user.avatar
														? user.status
														: 'Pending Profile Completion'
												}
											/>
										)}
									</div>

									<div className='flex-1'>
										<label
											htmlFor='roleSelection'
											className={isEdit ? 'required-input-label' : undefined}
										>
											Role
										</label>
										{isEdit ? (
											<>
												<select
													className='w-full'
													id='roleSelection'
													required
													value={role}
													onChange={(e) => setRole(e.target.value)}
												>
													<option value={Object.keys(ROLES_LIST)[2]}>
														Postgraduate
													</option>
													<option value={Object.keys(ROLES_LIST)[3]}>
														Undergraduate
													</option>
													<option value={Object.keys(ROLES_LIST)[4]}>
														Guest
													</option>
												</select>
												<p className='mt-2 text-xs text-gray-400'>
													User role for the current lab.
												</p>
											</>
										) : (
											<input
												className='w-full capitalize'
												type='text'
												name='roleSelection'
												id='roleSelection'
												readOnly
												value={user.role}
											/>
										)}
									</div>
								</div>

								<div className='mb-9 flex items-center justify-between space-x-6 text-sm text-gray-500'>
									<p>
										Registered At:{' '}
										<span className='font-semibold'>
											{FormatDate(user.createdAt)}
										</span>
									</p>
									<p>
										Last Updated:{' '}
										<span className='font-semibold'>
											{FormatDate(user.lastUpdated)}
										</span>
									</p>
								</div>

								{isRemove ? (
									<div className='flex items-center justify-end'>
										<div className='mr-auto'>
											<p className='font-medium text-gray-900'>
												Confirm remove user from the current lab?
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
												Remove User
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

export default EditUserModal
