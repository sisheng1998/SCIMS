import React, { useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal'

const AccountSection = ({ user }) => {
	const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)

	return (
		<>
			<div className='my-3 rounded-lg border border-gray-300 bg-white p-6 shadow'>
				<div className='flex items-end justify-between'>
					<label htmlFor='email'>Email Address</label>
					<button
						className='mb-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700'
						onClick={() => {}}
					>
						Change Email
					</button>
				</div>
				<input
					className='mb-2 w-full'
					type='text'
					name='email'
					id='email'
					readOnly
					value={user.email}
				/>
				<p
					className={`mb-6 text-sm font-medium ${
						user.isEmailVerified ? 'text-green-600' : 'text-red-600'
					}`}
				>
					{user.isEmailVerified ? 'Verified' : 'Not Verified'}
				</p>

				<label htmlFor='password'>Password</label>
				<button
					className='button button-outline w-full max-w-xs justify-center px-4 py-3'
					onClick={() => setOpenChangePasswordModal(true)}
				>
					Change Password
				</button>
			</div>

			{openChangePasswordModal && (
				<ChangePasswordModal
					openModal={openChangePasswordModal}
					setOpenModal={setOpenChangePasswordModal}
				/>
			)}
		</>
	)
}

export default AccountSection
