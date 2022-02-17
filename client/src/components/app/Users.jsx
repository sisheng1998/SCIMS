import React, { useState, useEffect } from 'react'
import Title from './components/Title'
import UsersTable from './components/UsersTable'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import GetRoleName from '../others/GetRoleName'

const Users = () => {
	const axiosPrivate = useAxiosPrivate()
	const [usersData, setUsersData] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const { auth } = useAuth()

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
					const processedData = data.data.labUsers.map((user, index) => {
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
	}, [axiosPrivate, auth])

	const addUser = () => {
		console.log('Hello')
	}

	return isLoading ? (
		'Loading...'
	) : (
		<>
			<Title
				title='All Users'
				hasButton={true}
				buttonText='Add User'
				buttonAction={addUser}
			/>
			<UsersTable data={usersData} />
		</>
	)
}

export default Users
