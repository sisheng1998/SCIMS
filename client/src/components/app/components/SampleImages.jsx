import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Image1 from '././../../../images/img-1.jpg'
import Image2 from '././../../../images/img-2.jpg'
import Image3 from '././../../../images/img-3.jpg'
import Image4 from '././../../../images/img-4.jpg'
import Image5 from '././../../../images/img-5.jpg'
import Image6 from '././../../../images/img-6.jpg'

const images = [Image1, Image2, Image3, Image4, Image5, Image6]

const SampleImages = () => {
	const [openModal, setOpenModal] = useState(false)

	const closeHandler = () => {
		setOpenModal(false)
	}

	return (
		<>
			<span
				onClick={() => {
					setOpenModal(true)
				}}
				className='mb-2 cursor-pointer text-xs font-medium text-indigo-600 transition hover:text-indigo-700'
			>
				Sample Pictures
			</span>

			{openModal && (
				<Dialog
					open={openModal}
					onClose={() => {}}
					className='fixed inset-0 z-10 overflow-y-auto'
				>
					<div className='flex min-h-screen items-center justify-center'>
						<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
						<div className='relative w-full max-w-xl rounded-lg bg-white p-6 shadow lg:m-4'>
							<div className='mb-4 flex justify-between'>
								<h4>Sample Profile Pictures</h4>
								<button
									className='cursor-pointer hover:text-indigo-600 focus:outline-none'
									onClick={closeHandler}
								>
									<XIcon className='h-5 w-5' />
								</button>
							</div>

							<div className='grid grid-cols-3 gap-2'>
								{images.map((image, index) => (
									<img
										key={index}
										src={image}
										alt='Avatar'
										className='w-full object-cover'
										width='160'
										height='160'
										draggable={false}
									/>
								))}
							</div>

							<p className='mt-4 text-xs'>
								Preferred 500px x 500px (Square), file size less than 100 KB.
							</p>
						</div>
					</div>
				</Dialog>
			)}
		</>
	)
}

export default SampleImages
