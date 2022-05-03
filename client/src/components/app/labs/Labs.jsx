import React, { useState } from 'react'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import { PlusIcon } from '@heroicons/react/outline'
import ApplyNewLabModal from './ApplyNewLabModal'
import LabCard from './LabCard'

const Labs = () => {
	const [openApplyNewLabModal, setOpenApplyNewLabModal] = useState(false)
	const { auth } = useAuth()

	return (
		<>
			<Title title='My Labs' hasButton={false} hasRefreshButton={false} />

			<div className='-mr-6 flex flex-wrap xl:-mr-4'>
				{auth.roles.map((role) => (
					<LabCard key={role._id} role={role} />
				))}

				<div className='mb-6 w-1/5 2xl:w-1/4 xl:mb-4 xl:w-1/3 lg:w-1/2 sm:mb-0 sm:w-full'>
					<div
						className='group mr-6 flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 hover:border-indigo-600 hover:bg-indigo-50 xl:mr-4'
						onClick={() => setOpenApplyNewLabModal(true)}
					>
						<PlusIcon className='h-10 w-10 stroke-1 text-gray-400 group-hover:text-indigo-600' />
						<p className='mt-2 font-medium text-gray-400 group-hover:text-indigo-600'>
							Apply New Lab
						</p>
					</div>
				</div>
			</div>

			{openApplyNewLabModal && (
				<ApplyNewLabModal
					openModal={openApplyNewLabModal}
					setOpenModal={setOpenApplyNewLabModal}
				/>
			)}
		</>
	)
}

export default Labs
