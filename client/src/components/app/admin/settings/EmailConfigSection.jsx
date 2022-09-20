import React, { useState } from 'react'
import EditEmailConfigModal from './EditEmailConfigModal'

const EmailConfigSection = ({ settings, setEditSuccess }) => {
	const [openEditEmailConfigModal, setOpenEditEmailConfigModal] =
		useState(false)

	return (
		<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
			<div className='mb-6 flex space-x-6'>
				<div className='flex-1'>
					<label htmlFor='fromName'>From Name</label>
					<input
						className='w-full'
						type='text'
						name='fromName'
						id='fromName'
						readOnly
						value={settings.FROM_NAME}
					/>
					<p className='mt-2 text-xs text-gray-400'>Name of the sender.</p>
				</div>

				<div className='flex-1'>
					<label htmlFor='fromEmail'>From Email</label>
					<input
						className='w-full'
						type='text'
						name='fromEmail'
						id='fromEmail'
						readOnly
						value={settings.FROM_EMAIL}
					/>
					<p className='mt-2 text-xs text-gray-400'>Email of the sender.</p>
				</div>
			</div>

			<div className='flex space-x-6'>
				<div className='flex-1'>
					<label htmlFor='username'>Gmail Username</label>
					<input
						className='w-full'
						type='text'
						name='username'
						id='username'
						readOnly
						value={settings.EMAIL_USERNAME}
					/>
					<p className='mt-2 text-xs text-gray-400'>Username for the gmail.</p>
				</div>

				<div className='flex-1'>
					<label htmlFor='password'>App Password</label>
					<input
						className='w-full'
						type='password'
						name='password'
						id='password'
						readOnly
						value={settings.EMAIL_PASSWORD}
					/>
					<p className='mt-2 text-xs text-gray-400'>
						Password for the custom app in gmail.
					</p>
				</div>
			</div>

			<button
				className='button button-outline mt-9 block w-60 justify-center px-4 py-3'
				onClick={() => setOpenEditEmailConfigModal(true)}
			>
				Edit Email Configuration
			</button>

			{openEditEmailConfigModal && (
				<EditEmailConfigModal
					settings={settings}
					openModal={openEditEmailConfigModal}
					setOpenModal={setOpenEditEmailConfigModal}
					setEditSuccess={setEditSuccess}
				/>
			)}
		</div>
	)
}

export default EmailConfigSection
