import React from 'react'
import GetRoleName from '../../others/GetRoleName'

const UsersTable = (props) => {
	const tableHeaders = ['Name', 'Email Address', 'Status', 'Role', 'Action']

	const getCurrentRole = (roles) => {
		const currentRole = roles.find((role) => {
			return role.lab === props.data._id
		})
		return currentRole
	}

	return (
		<div className='overflow-hidden rounded-lg border-b border-gray-300 shadow'>
			<table className='min-w-full divide-y divide-gray-300'>
				<thead className='bg-gray-50'>
					<tr>
						{tableHeaders.map((title, index) => (
							<th
								key={index}
								scope='col'
								className='px-6 py-3 text-left font-medium text-gray-500'
							>
								{title}
							</th>
						))}
					</tr>
				</thead>

				<tbody className='divide-y divide-gray-300 bg-white'>
					{props.data.labUsers.map((user) => {
						const currentRole = getCurrentRole(user.roles)

						let classes

						if (currentRole.status === 'Active') {
							classes = 'bg-green-100 text-green-600'
						} else if (currentRole.status === 'Pending') {
							classes = 'bg-yellow-100 text-yellow-600'
						} else {
							// Deactivated
							classes = 'bg-red-100 text-red-600'
						}

						return (
							<tr key={user._id}>
								<td className='px-6 py-4'>{user.name}</td>
								<td className='px-6 py-4'>{user.email}</td>
								<td className='px-6 py-4'>
									<span
										className={`rounded-full px-2 py-1 font-medium ${classes}`}
									>
										{currentRole.status}
									</span>
								</td>
								<td className='px-6 py-4 capitalize'>
									{GetRoleName(currentRole.role)}
								</td>
								<td className='px-6 py-4'>Edit</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default UsersTable
