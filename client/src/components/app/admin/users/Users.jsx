import React, { useState, useEffect } from 'react'
import AddUserModal from './AddUserModal'
import Title from '../../components/Title'
import UsersTable from './UsersTable'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'

const Users = () => {
	const axiosPrivate = useAxiosPrivate()
	const [usersData, setUsersData] = useState('')
	const [labsData, setLabsData] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	const [openAddUserModal, setOpenAddUserModal] = useState(false)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) {
			setRefresh(false)
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getUsers = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/admin/users', {
					signal: controller.signal,
				})
				if (isMounted) {
					const processedData = data.users.map((user, index) => ({
						...user,
						index: index,
					}))
					setUsersData(processedData)
					setLabsData(data.labs)
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
	}, [axiosPrivate, refresh])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title
				title='All Users'
				hasButton={true}
				hasRefreshButton={true}
				buttonText='Add User'
				buttonAction={() => setOpenAddUserModal(true)}
				setRefresh={setRefresh}
			/>
			<UsersTable
				data={usersData}
				labs={labsData}
				setEditUserSuccess={setRefresh}
			/>
			{openAddUserModal && (
				<AddUserModal
					users={usersData}
					labs={labsData}
					openModal={openAddUserModal}
					setOpenModal={setOpenAddUserModal}
					setAddUserSuccess={setRefresh}
				/>
			)}
		</>
	)
}

export default Users
