import React from 'react'
import { Dialog } from '@headlessui/react'
import { QrReader } from 'react-qr-reader'
import { useNavigate } from 'react-router-dom'

const ScanQRCodeModal = ({ openModal, setOpenModal }) => {
	const navigate = useNavigate()

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
				<Dialog.Overlay className='fixed inset-0 bg-black' />

				<div className='z-20 w-full mb-20'>
					<QrReader
						onResult={(result) => {
							if (!!result && result.text) {
								const location = '/inventory/' + result.text
								navigate(location)
							}
						}}
						scanDelay='1000'
						constraints={{facingMode: 'environment'}}
					/>
				</div>

				<div className='fixed left-0 right-0 bottom-0 z-20 w-full border-t border-gray-200 bg-white shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)]'>
					<button
						className='h-12 w-full justify-center font-medium text-gray-500'
						onClick={closeHandler}
					>
						Cancel
					</button>
				</div>
			</div>
		</Dialog>
	)
}

export default ScanQRCodeModal
