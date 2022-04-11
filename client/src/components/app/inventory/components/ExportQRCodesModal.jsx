import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FormatChemicalDate } from '../../../utils/FormatDate'

const tableHeaders = ['CAS No.', 'Name', 'Exp. Date']

const ExportQRCodesModal = ({ chemicals, openModal, setOpenModal }) => {
	const closeHandler = () => setOpenModal(false)
	const [searchTerm, setSearchTerm] = useState('')

	const match = (CAS, name) =>
		CAS.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
		name.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div className='relative w-full max-w-3xl rounded-lg bg-white p-6 shadow'>
					<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
						<h4>Export QR Codes</h4>
						<XIcon
							className='h-5 w-5 cursor-pointer hover:text-indigo-600'
							onClick={closeHandler}
						/>
					</div>

					<label htmlFor='searchChemicals'>Search Chemicals</label>
					<input
						type='text'
						id='searchChemicals'
						className='w-full text-sm'
						autoComplete='off'
						spellCheck='false'
						placeholder='CAS No. / Name'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					<label htmlFor='chemicals' className='mt-6'>
						Chemicals
					</label>
					<div className='overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3 shadow-sm'>
						<div className='max-h-80 overflow-x-auto'>
							<div className='border-b border-gray-200'>
								<table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
									<thead className='sticky top-0 bg-gray-50'>
										<tr>
											<th className='w-9 py-2 pl-3 pr-2' scope='col'>
												<input
													type='checkbox'
													name='all'
													id='all'
													className='mb-1 cursor-pointer'
												/>
											</th>
											{tableHeaders.map((title, index) => (
												<th
													scope='col'
													key={index}
													className='px-3 py-2 text-left font-medium text-gray-500'
												>
													{title}
												</th>
											))}
										</tr>
									</thead>

									<tbody className='divide-y divide-gray-200 bg-white'>
										{chemicals.length === 0 ? (
											<tr>
												<td
													className='px-3 py-2 text-center'
													colSpan={tableHeaders.length}
												>
													No record found.
												</td>
											</tr>
										) : (
											chemicals.map((chemical) => (
												<tr
													key={chemical._id}
													className={`cursor-pointer hover:bg-indigo-50 ${
														match(chemical.CAS, chemical.name) ? '' : 'hidden'
													}`}
												>
													<td className='w-9 py-2 pl-3 pr-2 text-center'>
														<input
															type='checkbox'
															name={chemical._id}
															id={chemical._id}
															value={chemical.QRCode}
															className='pointer-events-none mb-0.5'
														/>
													</td>

													<td className='px-3 py-2'>{chemical.CAS}</td>
													<td className='px-3 py-2'>{chemical.name}</td>
													<td className='px-3 py-2 capitalize'>
														{FormatChemicalDate(chemical.expirationDate)}
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<p className='mt-2 text-xs text-gray-400'>
						Select chemicals to export their QR Codes as PDF.
					</p>

					<div className='mt-9 flex items-center justify-end'>
						<p className='mr-auto self-end text-sm'>
							Selected: <span className='font-semibold'>0</span> /{' '}
							{chemicals.length} chemicals
						</p>
						<span
							onClick={closeHandler}
							className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
						>
							Cancel
						</span>
						<button
							className='button button-solid ml-6 w-40 justify-center'
							disabled={true}
						>
							Export Selection
						</button>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

export default ExportQRCodesModal