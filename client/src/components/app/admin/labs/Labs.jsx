import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'

const Labs = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/')
	}, [auth.currentLabId, navigate])

	return <div>Admin Labs</div>
}

export default Labs
