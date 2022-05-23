import React, { useState } from 'react'
import {
	LocationMarkerIcon,
	BeakerIcon,
	PencilAltIcon,
	TrashIcon,
} from '@heroicons/react/outline'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'
import EditRecordModal from './EditRecordModal'
import RemoveRecordModal from './RemoveRecordModal'

const ChemicalCard = ({ chemical, chemicals, setChemicals }) => {
	const [openEditRecordModal, setOpenEditRecordModal] = useState(false)
	const [openRemoveRecordModal, setOpenRemoveRecordModal] = useState(false)

	return (
		<>
			<div className='mb-4 rounded-lg bg-white p-4 text-sm shadow'>
				<div className='mb-2 flex items-start justify-between space-x-4'>
					<div>
						<p className='text-lg font-medium leading-6 text-gray-900'>
							{chemical.name}
						</p>
						<p className='text-gray-500'>{chemical.CASNo}</p>
					</div>

					<div className='flex items-center space-x-2'>
						<button
							onClick={() => setOpenEditRecordModal(true)}
							className='text-indigo-600 focus:outline-none'
						>
							<PencilAltIcon className='h-5 w-5' />
						</button>

						<span className='text-gray-200'>|</span>

						<button
							onClick={() => setOpenRemoveRecordModal(true)}
							className='text-red-600 focus:outline-none'
						>
							<TrashIcon className='h-5 w-5' />
						</button>
					</div>
				</div>

				<div className='flex flex-wrap items-center'>
					<p className='mt-2 mr-4 flex items-center'>
						<LocationMarkerIcon className='mr-1.5 inline-block h-4 w-4 stroke-2 text-indigo-600' />
						{chemical.location}
					</p>

					<p className='mt-2 mr-4 flex items-center'>
						<BeakerIcon className='mr-1.5 inline-block h-4 w-4 stroke-2 text-indigo-600' />
						{FormatAmountWithUnit(chemical.amount, chemical.unit)}
					</p>
				</div>
			</div>

			{openEditRecordModal && (
				<EditRecordModal
					chemical={chemical}
					chemicals={chemicals}
					setChemicals={setChemicals}
					openModal={openEditRecordModal}
					setOpenModal={setOpenEditRecordModal}
				/>
			)}

			{openRemoveRecordModal && (
				<RemoveRecordModal
					chemical={chemical}
					chemicals={chemicals}
					setChemicals={setChemicals}
					openModal={openRemoveRecordModal}
					setOpenModal={setOpenRemoveRecordModal}
				/>
			)}
		</>
	)
}

export default ChemicalCard
