import React, { useState } from 'react'
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

const UserApprovalModal = ({
	user,
	openModal,
	setOpenModal,
	setUserApprovalSuccess,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const userId = user._id
	const labId = auth.currentLabId
	const [role, setRole] = useState(getKeyByValue(user.roleValue))
	const [message, setMessage] = useState('')
	const [approve, setApprove] = useState(false)

	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const userApprovalHandler = async (e) => {
		e.preventDefault()

		try {
			await axiosPrivate.post('/api/private/user/approval', {
				userId,
				labId,
				role: ROLES_LIST[role],
				message,
				approve,
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

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			setSuccess(false)
			setUserApprovalSuccess(true)
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
						success ? 'max-w-sm text-center' : 'max-w-3xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>
								User Request Updated!
							</h2>
							<p>The message has been sent to the user.</p>
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
								<h4>User Request Approval</h4>
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
								onSubmit={userApprovalHandler}
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
										<p className='mt-2 text-xs text-gray-400'>
											Current lab cannot be changed.
										</p>
									</div>

									<div className='flex-1'>
										<label htmlFor='statusSelection'>Status</label>
										<input
											className='w-full'
											type='text'
											name='statusSelection'
											id='statusSelection'
											readOnly
											value={user.status}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Current status of the user.
										</p>
									</div>

									<div className='flex-1'>
										<label htmlFor='roleSelection'>Role</label>
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
											<option value={Object.keys(ROLES_LIST)[4]}>Guest</option>
										</select>
										<p className='mt-2 text-xs text-gray-400'>
											User role for the current lab.
										</p>
									</div>
								</div>

								<div className='mb-6'>
									<label htmlFor='message'>Message</label>
									<input
										className='block w-full'
										type='text'
										name='message'
										id='message'
										placeholder='Message for the user'
										value={message}
										onChange={(e) => setMessage(e.target.value)}
									/>
									<p className='mt-2 text-xs text-gray-400'>
										The message will be sent to the user via email.
									</p>
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

								<div className='flex items-center justify-end space-x-4'>
									<button
										className='button-green w-32'
										type='submit'
										onClick={() => setApprove(true)}
									>
										Approve
									</button>
									<button
										className='button-red w-32'
										type='submit'
										onClick={() => setApprove(false)}
									>
										Decline
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

export default UserApprovalModal
