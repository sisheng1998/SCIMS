import React from 'react'

const AccountSection = ({ user, setRefresh }) => {
	return (
		<div className='mt-3 mb-16 rounded-lg border border-gray-300 bg-white p-6 shadow'>
			<div className='flex items-end justify-between'>
				<label htmlFor='email'>Email Address</label>
				<p
					className={`mb-2 text-sm font-medium ${
						user.isEmailVerified ? 'text-green-600' : 'text-red-600'
					}`}
				>
					{user.isEmailVerified ? 'Verified' : 'Not Verified'}
				</p>
			</div>
			<input
				className='mb-6 w-full'
				type='text'
				name='email'
				id='email'
				readOnly
				value={user.email}
			/>

			<label htmlFor='password'>Password</label>
			<button
				className='button button-outline w-full max-w-xs justify-center px-4 py-3'
				onClick={() => {}}
			>
				Change Password
			</button>
		</div>
	)
}

export default AccountSection
