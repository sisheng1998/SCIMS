import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/')
	}, [auth.currentLabId, navigate])

	return <div>Admin Dashboard</div>
}

export default Dashboard
