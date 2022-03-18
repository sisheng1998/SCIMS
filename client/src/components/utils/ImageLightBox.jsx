import React from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

const ImageLightBox = ({ user, openModal, setOpenModal }) => {
	const closeHandler = () => {
		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div className='relative w-full max-w-lg rounded-lg bg-white p-6 shadow'>
					<div className='mb-4 flex justify-between'>
						<h4>{user.name}</h4>
						<button
							className='cursor-pointer hover:text-indigo-600 focus:outline-none'
							onClick={closeHandler}
						>
							<XIcon className='h-5 w-5' />
						</button>
					</div>

					<img
						src={user.imageSrc}
						alt='Avatar'
						className='aspect-square object-cover'
						width='500'
						height='500'
					/>
				</div>
			</div>
		</Dialog>
	)
}

export default ImageLightBox
