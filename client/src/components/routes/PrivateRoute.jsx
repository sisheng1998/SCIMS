import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import ROLES_LIST from '../../config/roles_list'

const allLabs = {
	lab: { _id: ROLES_LIST.admin.toString(), labName: 'All Labs' },
	role: ROLES_LIST.admin,
}

const PrivateRoute = () => {
	const { auth, setAuth } = useAuth()
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		if (!auth?.accessToken) {
			setIsLoading(false)
			return
		}

		const activeRole = auth.roles.find((role) => {
			return role.status === 'Active'
		})

		// Not yet approve by any lab owner
		if (!activeRole) {
			setIsLoading(false)
			navigate('/pending-approval')
		} else {
			// Check whether user is admin
			const isAdmin = auth.roles.some((role) => {
				return role.role === ROLES_LIST.admin && role.status === 'Active'
			})

			// Check if local storage has stored current lab
			const currentLab = localStorage.getItem('currentLab')

			// If local storage has value
			if (currentLab) {
				// If the user is admin and the current lab is All Labs
				if (isAdmin && currentLab === allLabs.lab._id) {
					setAuth((prev) => {
						return {
							...prev,
							currentLabId: allLabs.lab._id,
							currentLabName: allLabs.lab.labName,
							currentRole: allLabs.role,
						}
					})
					setIsLoading(false)
					return
				}

				// Get the role
				const currentRole = auth.roles.find((role) => {
					return role.lab._id === currentLab
				})

				// Check the status of the role
				if (currentRole && currentRole.status === 'Active') {
					// Set the current role to auth context
					setAuth((prev) => {
						return {
							...prev,
							currentLabId: currentRole.lab._id,
							currentLabName: currentRole.lab.labName,
							currentRole: currentRole.role,
						}
					})
				} else {
					// Set the first lab with active role to local storage and auth context
					localStorage.setItem('currentLab', activeRole.lab._id)
					setAuth((prev) => {
						return {
							...prev,
							currentLabId: activeRole.lab._id,
							currentLabName: activeRole.lab.labName,
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
						currentLabId: activeRole.lab._id,
						currentLabName: activeRole.lab.labName,
						currentRole: activeRole.role,
					}
				})
			}
		}
		setIsLoading(false)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return isLoading ? null : auth?.accessToken ? (
		<Outlet />
	) : (
		<Navigate to='/login' />
	)
}

export default PrivateRoute
