import React from 'react'
import { Dialog } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/outline'

const SuccessMessageModal = ({
	chemicalId,
	type,
	openModal,
	setOpenModal,
	setEditSuccess,
}) => {
	const navigate = useNavigate()

	const closeHandler = () => {
		setOpenModal(false)

		if (type === 'Add' && chemicalId) {
			navigate(`/inventory/${chemicalId}`)
		} else if (type === 'Remove') {
			navigate('/inventory')
		} else if (type === 'Edit') {
			setEditSuccess(true)
		}
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div className='relative w-full max-w-sm rounded-lg bg-white p-6 text-center shadow'>
					<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />

					{type === 'Add' && (
						<>
							<h2 className='mt-6 mb-2 text-green-600'>New Chemical Added!</h2>
							<p>The new chemical have been added.</p>
						</>
					)}

					{type === 'Remove' && (
						<>
							<h2 className='mt-6 mb-2 text-green-600'>Chemical Removed!</h2>
							<p>The chemical have been removed.</p>
						</>
					)}

					{type === 'Edit' && (
						<>
							<h2 className='mt-6 mb-2 text-green-600'>Info Updated!</h2>
							<p>The information have been updated.</p>
						</>
					)}

					<button
						className='button button-solid mt-6 w-32 justify-center'
						onClick={closeHandler}
					>
						Okay
					</button>
				</div>
			</div>
		</Dialog>
	)
}

export default SuccessMessageModal