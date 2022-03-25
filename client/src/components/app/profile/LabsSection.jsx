import React from 'react'
import GetRoleName from '../../utils/GetRoleName'

const tableHeaders = ['Name', 'Status', 'Role']

const LabsSection = ({ user }) => {
	return (
		<div className='mb-6 w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm'>
			<div className='overflow-x-auto'>
				<div className='border-b border-gray-200'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='sticky top-0 bg-gray-50'>
							<tr>
								{tableHeaders.map((title, index) => (
									<th
										scope='col'
										key={index}
										className='px-6 py-4 text-left font-medium text-gray-500'
									>
										{title}
									</th>
								))}
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200 bg-white'>
							{user.roles.length === 0 ? (
								<tr>
									<td className='px-6 py-4'>-</td>
									<td className='px-6 py-4'>-</td>
									<td className='px-6 py-4'>-</td>
								</tr>
							) : (
								user.roles
									.sort((a, b) =>
										a.lab.labName.toLowerCase() > b.lab.labName.toLowerCase()
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
												<td className='px-6 py-4'>
													{'Lab ' + role.lab.labName}
													{role.lab.status === 'Not In Use' && (
														<span className='ml-2 text-xs font-medium text-red-600'>
															Not In Use
														</span>
													)}
												</td>
												<td className='px-6 py-4'>
													<span
														className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
													>
														{role.status}
													</span>
												</td>
												<td className='px-6 py-4 capitalize'>
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
	)
}

export default LabsSection
