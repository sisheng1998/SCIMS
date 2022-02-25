import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../others/LoadingScreen'

const Users = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	console.log(auth)

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/users')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()
	const [usersData, setUsersData] = useState('')
	const [isLoading, setIsLoading] = useState(true)

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
					console.log(data.users)
					setUsersData('')
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

	return isLoading ? <LoadingScreen /> : <div>Admin Users</div>
}

export default Users
