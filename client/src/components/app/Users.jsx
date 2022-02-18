import React, { useState, useEffect } from 'react'
import AddUserModal from './components/AddUserModal'
import Title from './components/Title'
import UsersTable from './components/UsersTable'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import GetRoleName from '../others/GetRoleName'
import ROLES_LIST from '../../config/roles_list'

const Users = () => {
	const axiosPrivate = useAxiosPrivate()
	const [usersData, setUsersData] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const { auth } = useAuth()

	const [openModal, setOpenModal] = useState(false)
	const [addUserSuccess, setAddUserSuccess] = useState(false)

	useEffect(() => {
		setIsLoading(true)

		let isMounted = true
		const controller = new AbortController()

		const getUsers = async () => {
			try {
				const { data } = await axiosPrivate.post(
					'/api/private/users',
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					data.data.labUsers.unshift(data.data.labOwner)
					const processedData = data.data.labUsers
						.filter((user) => user.isEmailVerified)
						.map((user, index) => {
							const currentRole = user.roles.find((role) => {
								return role.lab === data.data._id
							})

							return {
								...user,
								index: index,
								role: GetRoleName(currentRole.role),
								status: currentRole.status,
							}
						})
					// LabUsers array
					setUsersData(processedData)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getUsers()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth, addUserSuccess])

	return isLoading ? (
		'Loading...'
	) : (
		<>
			<Title
				title='All Users'
				hasButton={auth.currentRole >= ROLES_LIST.labOwner}
				buttonText='Add User'
				buttonAction={() => setOpenModal(true)}
			/>
			<UsersTable data={usersData} />
			{auth.currentRole >= ROLES_LIST.labOwner && (
				<AddUserModal
					openModal={openModal}
					setOpenModal={setOpenModal}
					success={addUserSuccess}
					setSuccess={setAddUserSuccess}
				/>
			)}
		</>
	)
}

export default Users
