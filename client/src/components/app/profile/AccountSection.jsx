import React, { useState } from 'react'
import ChangeEmailModal from './ChangeEmailModal'
import ChangePasswordModal from './ChangePasswordModal'

const AccountSection = ({ user }) => {
	const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false)
	const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)

	return (
		<>
			<div className='w-full max-w-lg'>
				<div className='flex items-end justify-between'>
					<label htmlFor='email'>
						Email Address
						<span
							className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
								user.isEmailVerified
									? 'bg-green-100 text-green-600'
									: 'bg-red-100 text-red-600'
							}`}
						>
							{user.isEmailVerified ? 'Verified' : 'Not Verified'}
						</span>
					</label>
					<button
						className='mb-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
						onClick={() => setOpenChangeEmailModal(true)}
					>
						Change Email
					</button>
				</div>
				<input
					className='mb-6 w-full'
					type='text'
					name='email'
					id='email'
					readOnly
					value={user.email}
				/>
			</div>

			<label htmlFor='password'>Password</label>
			<button
				className='button button-outline w-60 justify-center px-4 py-3'
				onClick={() => setOpenChangePasswordModal(true)}
			>
				Change Password
			</button>

			{openChangePasswordModal && (
				<ChangePasswordModal
					openModal={openChangePasswordModal}
					setOpenModal={setOpenChangePasswordModal}
				/>
			)}

			{openChangeEmailModal && (
				<ChangeEmailModal
					user={user}
					openModal={openChangeEmailModal}
					setOpenModal={setOpenChangeEmailModal}
				/>
			)}
		</>
	)
}

export default AccountSection
