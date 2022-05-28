import React, { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import {
	CLASSIFICATION_LIST,
	COC_LIST,
} from '../../../config/safety_security_list'
import RenderPDF from '../components/RenderPDF'
import FormatDate from '../../utils/FormatDate'

const ViewSDSModal = ({ CAS, openModal, setOpenModal }) => {
	const divRef = useRef(null)
	const closeHandler = () => setOpenModal(false)

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			initialFocus={divRef}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div
				ref={divRef}
				className='flex min-h-screen items-center justify-center'
			>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div className='relative m-4 w-full max-w-3xl rounded-lg bg-white p-6 shadow'>
					<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
						<h4>View SDS Information</h4>
						<XIcon
							className='h-5 w-5 cursor-pointer hover:text-indigo-600'
							onClick={closeHandler}
						/>
					</div>

					<label htmlFor='CAS' className='mb-0.5'>
						CAS No.
					</label>
					<p className='mb-6 font-medium'>{CAS.CASNo}</p>

					<label htmlFor='SDS' className='mb-1'>
						Safety Data Sheet (SDS)
					</label>
					<RenderPDF PDF={CAS.SDS} />

					<div className='mb-4 mt-6'>
						<label htmlFor='classification'>GHS Classifications</label>
						{CAS.classifications.length !== 0
							? CLASSIFICATION_LIST.filter((classification) =>
									CAS.classifications.includes(classification)
							  ).map((classification, index) => (
									<span
										key={index}
										className={`mb-2 mr-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
											classification === CLASSIFICATION_LIST[8] ||
											classification === CLASSIFICATION_LIST[7] ||
											classification === CLASSIFICATION_LIST[6] ||
											classification === CLASSIFICATION_LIST[5]
												? 'bg-blue-100 text-blue-600'
												: 'bg-yellow-100 text-yellow-600'
										}`}
									>
										{classification}
									</span>
							  ))
							: '-'}
					</div>

					<div>
						<label htmlFor='coc'>Chemical of Concerns</label>
						{CAS.COCs.length !== 0
							? COC_LIST.filter((security) => CAS.COCs.includes(security)).map(
									(security, index) => (
										<span
											key={index}
											className='mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600'
										>
											{security}
										</span>
									)
							  )
							: '-'}
					</div>

					<div className='mb-9 mt-6 flex items-center justify-between space-x-6 text-sm text-gray-500'>
						<p>
							Added At:{' '}
							<span className='font-semibold'>{FormatDate(CAS.createdAt)}</span>
						</p>
						<p>
							Last Updated:{' '}
							<span className='font-semibold'>
								{FormatDate(CAS.lastUpdated)}
							</span>
						</p>
					</div>

					<div className='flex items-center justify-end'>
						<span
							onClick={closeHandler}
							className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
						>
							Close
						</span>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

export default ViewSDSModal
