import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { QuestionMarkCircleIcon, XIcon } from '@heroicons/react/outline'
import { HEADERS } from '../../../../../config/import_export'

const Info = () => {
	const [openModal, setOpenModal] = useState(false)
	const divRef = useRef(null)
	const closeHandler = () => setOpenModal(false)

	return (
		<>
			<QuestionMarkCircleIcon
				onClick={() => setOpenModal(true)}
				className='ml-1.5 inline-block h-5 w-5 cursor-pointer stroke-2 text-gray-400 transition hover:text-indigo-700'
			/>

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
					<div className='relative m-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow'>
						<div className='mb-4 flex justify-between border-b border-gray-200 pb-3'>
							<h4>Import Info</h4>
							<XIcon
								className='h-5 w-5 cursor-pointer hover:text-indigo-600'
								onClick={closeHandler}
							/>
						</div>

						<label htmlFor='fieldsInfo'>Chemical Fields Information</label>
						<div className='overflow-hidden rounded-lg border border-gray-300 text-sm'>
							<div className='grid grid-cols-3 bg-gray-50 font-medium text-gray-500'>
								<p className='px-2.5 py-1.5'>Field</p>
								<p className='col-span-2 px-2.5 py-1.5'>Information</p>
							</div>

							{HEADERS.map((header, index) => (
								<div
									key={index}
									className='grid grid-cols-3 border-t border-gray-300 hover:bg-indigo-50/30'
								>
									<p className='px-2.5 py-1.5 font-medium'>
										{header.label}
										<span className='ml-2 text-xs font-normal italic text-gray-400'>
											{header.sample}
										</span>
									</p>

									<p className='col-span-2 px-2.5 py-1.5'>
										{header.description}
										<span className='ml-2 text-xs text-gray-400'>
											{header.label.endsWith('*') ? '(Required)' : '(Optional)'}
										</span>
									</p>
								</div>
							))}

							<div className='h-2 border-t border-gray-300 bg-gray-50'></div>
						</div>
						<p className='mt-2 text-xs text-gray-400'>
							Those fields with asterisk symbol (*) are required.
						</p>

						<div className='mt-6 flex items-center justify-end'>
							<button
								onClick={closeHandler}
								className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600 focus:outline-none'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	)
}

export default Info
