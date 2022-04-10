import React, { useState } from 'react'
import { QrcodeIcon } from '@heroicons/react/outline'
import ScanQRCodeModal from './ScanQRCodeModal'

const ScanQRCode = () => {
	const [openModal, setOpenModal] = useState(false)

	return (
		<>
			<div
				id='qrcode-scanner'
				className='fixed left-0 right-0 bottom-0 z-10 w-full border-t border-gray-200 bg-white p-4 shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)]'
			>
				<button
					className='button button-solid w-full justify-center shadow-md'
					onClick={() => setOpenModal(true)}
				>
					<QrcodeIcon className='mr-2 h-6 w-6' />
					Scan QR Code
				</button>
			</div>

			{openModal && (
				<ScanQRCodeModal openModal={openModal} setOpenModal={setOpenModal} />
			)}
		</>
	)
}

export default ScanQRCode
