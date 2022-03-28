import React, { useState } from 'react'
import GetLetterPicture from '../../utils/GetLetterPicture'
import UpdateAvatarModal from './UpdateAvatarModal'
import EditPersonalInfoModal from './EditPersonalInfoModal'

const PersonalSection = ({ user, setRefresh }) => {
	const imageSrc = user.avatar ? user.avatar : GetLetterPicture(user.name)
	const [openUpdateAvatarModal, setOpenUpdateAvatarModal] = useState(false)
	const [openEditPersonalInfoModal, setOpenEditPersonalInfoModal] =
		useState(false)

	return (
		<>
			<label htmlFor='avatar'>Profile Picture</label>
			<div className='relative mb-6 inline-block'>
				<img
					className='h-80 w-80 object-cover'
					src={imageSrc}
					alt='Avatar'
					width='500'
					height='500'
				/>

				<button
					className='button button-outline absolute top-0 right-0 m-3 px-3 py-2 text-xs font-semibold'
					onClick={() => setOpenUpdateAvatarModal(true)}
				>
					Change
				</button>
			</div>

			<label htmlFor='matricNo'>Matric/Staff Number</label>
			<input
				className='mb-6 w-1/3'
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
				className='mb-6 w-2/3'
				type='text'
				name='name'
				id='name'
				readOnly
				value={user.name}
			/>

			<label htmlFor='altEmail'>Alternative Email Address</label>
			<input
				className='mb-9 w-2/3'
				type='text'
				name='altEmail'
				id='altEmail'
				readOnly
				value={user.altEmail || '-'}
			/>

			<button
				className='button button-outline block w-full max-w-xs justify-center px-4 py-3'
				onClick={() => setOpenEditPersonalInfoModal(true)}
			>
				Edit Personal Info
			</button>

			{openUpdateAvatarModal && (
				<UpdateAvatarModal
					openModal={openUpdateAvatarModal}
					setOpenModal={setOpenUpdateAvatarModal}
				/>
			)}

			{openEditPersonalInfoModal && (
				<EditPersonalInfoModal
					user={user}
					openModal={openEditPersonalInfoModal}
					setOpenModal={setOpenEditPersonalInfoModal}
					setEditPersonalInfoSuccess={setRefresh}
				/>
			)}
		</>
	)
}

export default PersonalSection
