import React from 'react'

const PersonalSection = ({ user, setRefresh }) => {
	return (
		<div className='mt-3 mb-12 rounded-lg border border-gray-300 bg-white p-6 shadow'>
			<label htmlFor='matricNo'>Matric/Staff No.</label>
			<input
				className='mb-6 w-full'
				type='text'
				name='matricNo'
				id='matricNo'
				readOnly
				value={user.matricNo}
			/>

			<label htmlFor='name'>
				Full Name <span className='text-xs'>(as per IC/Passport)</span>
			</label>
			<input
				className='mb-6 w-full'
				type='text'
				name='name'
				id='name'
				readOnly
				value={user.name}
			/>

			<label htmlFor='altEmail'>Alternative Email Address</label>
			<input
				className='mb-9 w-full'
				type='text'
				name='altEmail'
				id='altEmail'
				readOnly
				value={user.altEmail || '-'}
			/>

			<button
				className='button button-outline w-full max-w-xs justify-center px-4 py-3'
				onClick={() => {}}
			>
				Edit Personal Info
			</button>
		</div>
	)
}

export default PersonalSection
