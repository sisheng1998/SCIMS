import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { QrReader } from 'react-qr-reader'

const ScanQRCodeModal = ({ openModal, setOpenModal }) => {
	const [data, setData] = useState('No result')

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

					<QrReader
						onResult={(result, error) => {
							if (!!result) {
								setData(result?.text)
							}

							if (!!error) {
								console.info(error)
							}
						}}
						scanDelay='1000'
						style={{ width: '100%' }}
					/>
					<p>{data}</p>

					<p className='mt-4 text-xs'>
						Preferred 500px x 500px (Square), file size less than 100 KB.
					</p>
				</div>
			</div>
		</Dialog>
	)
}

export default ScanQRCodeModal
