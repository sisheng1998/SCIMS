import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'

const Users = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/users')
	}, [auth.currentLabId, navigate])

	return <div>Admin Users</div>
}

export default Users
