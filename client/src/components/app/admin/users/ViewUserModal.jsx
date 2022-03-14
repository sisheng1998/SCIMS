import React from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import GetRoleName from '../../../others/GetRoleName'
import FormatDate from '../../../others/FormatDate'

const tableHeaders = ['Name', 'Status', 'Role']

const ViewUserModal = ({ user, openModal, setOpenModal }) => {
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
				<div className='relative w-full max-w-3xl rounded-lg bg-white p-6 shadow'>
					<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
						<h4>View User Information</h4>
						<XIcon
							className='h-5 w-5 cursor-pointer hover:text-indigo-600'
							onClick={closeHandler}
						/>
					</div>

					<div className='mb-6 flex space-x-6'>
						<div className='flex-1'>
							<label htmlFor='name'>
								Full Name <span className='text-xs'>(as per IC/Passport)</span>
							</label>
							<input
								className='w-full'
								type='text'
								name='name'
								id='name'
								readOnly
								value={user.name}
							/>
						</div>

						<div className='flex-1'>
							<div className='flex items-end justify-between'>
								<label htmlFor='email'>Email Address</label>
								<p
									className={`mb-2 text-xs font-medium ${
										user.isEmailVerified ? 'text-green-600' : 'text-red-600'
									}`}
								>
									{user.isEmailVerified ? 'Verified' : 'Not Verified'}
								</p>
							</div>
							<input
								className='w-full'
								type='text'
								name='email'
								id='email'
								readOnly
								value={user.email}
							/>
						</div>

						<div className='flex-1'>
							<label htmlFor='altEmail'>Alternative Email Address</label>
							<input
								className='w-full'
								type='text'
								name='altEmail'
								id='altEmail'
								readOnly
								value={user.altEmail}
							/>
						</div>
					</div>

					<label htmlFor='lab'>Labs</label>
					<div className='mb-6 overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3'>
						<div className='max-h-48 overflow-x-auto'>
							<div className='border-b border-gray-200'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='sticky top-0 bg-gray-50'>
										<tr>
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
										{user.roles.length === 0 ? (
											<tr>
												<td className='px-3 py-2'>-</td>
												<td className='px-3 py-2'>-</td>
												<td className='px-3 py-2'>-</td>
											</tr>
										) : (
											user.roles
												.sort((a, b) =>
													a.lab.labName.toLowerCase() >
													b.lab.labName.toLowerCase()
														? 1
														: -1
												)
												.map((role) => {
													let classes

													if (role.status === 'Active') {
														classes = 'bg-green-100 text-green-600'
													} else if (role.status === 'Pending') {
														classes = 'bg-yellow-100 text-yellow-600'
													} else {
														// Deactivated
														classes = 'bg-red-100 text-red-600'
													}

													return (
														<tr key={role.lab._id}>
															<td className='px-3 py-2'>
																{role.lab.labName}
																{role.lab.status === 'Not In Use' && (
																	<span className='ml-2 text-xs font-medium text-red-600'>
																		Not In Use
																	</span>
																)}
															</td>
															<td className='px-3 py-2'>
																<span
																	className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
																>
																	{role.status}
																</span>
															</td>
															<td className='px-3 py-2 capitalize'>
																{GetRoleName(role.role)}
															</td>
														</tr>
													)
												})
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div className='mb-6 flex items-center justify-between space-x-6 text-sm text-gray-500'>
						<p>
							Registered At:{' '}
							<span className='font-semibold'>
								{FormatDate(user.registeredAt)}
							</span>
						</p>
						<p>
							Last Updated:{' '}
							<span className='font-semibold'>
								{FormatDate(user.lastUpdated)}
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

export default ViewUserModal
