import React, { useEffect } from 'react'
import { useNavigate, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const PrivateRoute = () => {
	const { auth, setAuth } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const activeRole = auth.roles.find((role) => {
			return role.status === 'Active'
		})

		// Not yet approve by any lab owner
		if (!activeRole) {
			navigate('/pending-approval')
		} else {
			// Check if local storage has stored current lab
			const currentLab = localStorage.getItem('currentLab')

			if (currentLab) {
				// If local storage has, get the role
				const currentRole = auth.roles.find((role) => {
					return role.lab._id === currentLab
				})

				// Check the status of the role
				if (currentRole && currentRole.status === 'Active') {
					// Set the current role to auth context
					setAuth((prev) => {
						return {
							...prev,
							currentRole: currentRole.role,
						}
					})
				} else {
					// Set the first lab with active role to local storage and auth context
					localStorage.setItem('currentLab', activeRole.lab._id)
					setAuth((prev) => {
						return {
							...prev,
							currentRole: activeRole.role,
						}
					})
				}
			} else {
				// Set the first lab with active role to local storage and auth context
				localStorage.setItem('currentLab', activeRole.lab._id)
				setAuth((prev) => {
					return {
						...prev,
						currentRole: activeRole.role,
					}
				})
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return auth?.accessToken ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute
