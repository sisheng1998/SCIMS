import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Authorization = (props) => {
	const { auth } = useAuth()
	const authorized = auth.currentRole >= props.minRole

	return authorized ? <Outlet /> : <Navigate to='/' />
}

export default Authorization
