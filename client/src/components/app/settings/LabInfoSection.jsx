import React, { useState } from 'react'
import EditLabInfoModal from './EditLabInfoModal'
import StaticLabInfo from '../components/StaticLabInfo'

const LabInfoSection = ({ lab }) => {
	const [openEditLabInfoModal, setOpenEditLabInfoModal] = useState(false)

	return (
		<>
			<label htmlFor='labName'>Lab Name</label>
			<input
				className='mb-6 w-full max-w-lg'
				type='text'
				name='labName'
				id='labName'
				readOnly
				value={'Lab ' + lab.labName}
			/>

			<StaticLabInfo
				labUsersNo={lab.labUsers.length + 1}
				chemicalsNo={lab.chemicals.length + lab.disposedChemicals.length}
			/>

			<button
				className='button button-outline mt-9 block w-60 justify-center px-4 py-3'
				onClick={() => setOpenEditLabInfoModal(true)}
			>
				Edit Lab Info
			</button>

			{openEditLabInfoModal && (
				<EditLabInfoModal
					lab={lab}
					openModal={openEditLabInfoModal}
					setOpenModal={setOpenEditLabInfoModal}
				/>
			)}
		</>
	)
}

export default LabInfoSection
