import React from 'react'
import GetRoleName from '../../others/GetRoleName'

const tableHeaders = [
	{
		title: 'Name',
	},
	{
		title: 'Email Address',
	},
	{
		title: 'Status',
	},
	{
		title: 'Role',
	},
	{
		title: 'Action',
	},
]

const UsersTable = (props) => {
	const getCurrentRole = (roles) => {
		const currentRole = roles.find((role) => {
			return role.lab === props.data._id
		})
		return currentRole
	}

	const labOwnerRole = getCurrentRole(props.data.labOwner.roles)

	const labOwner = {
		name: props.data.labOwner.name,
		email: props.data.labOwner.email,
		status: labOwnerRole.status,
		role: GetRoleName(labOwnerRole.role),
	}

	return (
		<div className='overflow-hidden rounded-lg border-b border-gray-300 shadow'>
			<table className='min-w-full divide-y divide-gray-300'>
				<thead className='bg-gray-50'>
					<tr>
						{tableHeaders.map((header, index) => (
							<th
								key={index}
								scope='col'
								className='px-6 py-3 text-left text-sm font-medium text-gray-500'
							>
								{header.title}
							</th>
						))}
					</tr>
				</thead>

				<tbody className='divide-y divide-gray-300 bg-white'>
					<tr>
						<td>{labOwner.name}</td>
						<td>{labOwner.email}</td>
						<td>{labOwner.status}</td>
						<td>{labOwner.role}</td>
						<td>Edit</td>
					</tr>
					{props.data.labUsers.map((user) => {
						const currentRole = getCurrentRole(user.roles)

						return (
							<tr key={user._id}>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{currentRole.status}</td>
								<td>{GetRoleName(currentRole.role)}</td>
								<td>Edit</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default UsersTable
