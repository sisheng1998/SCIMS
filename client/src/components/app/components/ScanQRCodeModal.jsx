import React from 'react'
import { Dialog } from '@headlessui/react'
import { QrReader } from 'react-qr-reader'
import { useNavigate } from 'react-router-dom'

const containerStyle = {
	zIndex: '20',
	width: '100%',
	display: 'flex',
	position: 'absolute',
	top: '0',
	bottom: '0',
	left: '0',
	right: '0',
}

const videoContainerStyle = {
	paddingTop: '0',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}

const videoStyle = {
	objectFit: 'cover',
}

const ScanQRCodeModal = ({ openModal, setOpenModal }) => {
	const navigate = useNavigate()

	const closeHandler = () => {
		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-20 overflow-hidden'
		>
			<div className='flex min-h-screen justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black' />

				<QrReader
					onResult={(result) => {
						if (!!result && result.text) {
							const chemicalId = result.text.replace(/[^A-Za-z0-9]/g, '')
							const location = '/inventory/' + chemicalId
							setOpenModal(false)
							navigate(location)
						}
					}}
					scanDelay='1000'
					constraints={{ facingMode: 'environment' }}
					containerStyle={containerStyle}
					videoContainerStyle={videoContainerStyle}
					videoStyle={videoStyle}
					ViewFinder={() => (
						<div className='absolute z-30 h-60 w-60 border-4 border-green-600 shadow-[0_0_0_1000vw_rgba(0_0_0/50%)]'></div>
					)}
				/>

				<div className='fixed left-0 right-0 bottom-0 z-30 w-full bg-white/90 shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)]'>
					<button
						className='h-12 w-full justify-center font-medium text-gray-700'
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
