import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import ROLES_LIST from '../../config/roles_list'
import useMobile from '../../hooks/useMobile'

const admin = {
  lab: { _id: ROLES_LIST.admin.toString(), labName: 'Admin' },
  role: ROLES_LIST.admin,
}

const allLabs = {
  lab: { _id: 'All Labs', labName: 'All Labs' },
  role: ROLES_LIST.guest,
}

const PrivateRoute = () => {
  const { pathname } = useLocation()
  const { auth, setAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const isMobile = useMobile()

  useEffect(() => {
    if (!auth?.accessToken) {
      setIsLoading(false)
      return
    }

    const activeRole = auth.roles.find(
      (role) => role.status === 'Active' && role.lab.status === 'In Use'
    )

    if (auth.isProfileNotCompleted) {
      setIsLoading(false)
      navigate('/complete-your-profile')
    } else if (!activeRole && pathname === '/profile-update') {
      setIsLoading(false)
      navigate('/profile-update')
    } else if (!activeRole) {
      // Not yet approve by any lab owner or din't have any lab
      setIsLoading(false)
      navigate('/pending-approval')
    } else {
      // Check whether user is admin
      const isAdmin = !isMobile && auth.isAdmin

      // Check if local storage has stored current lab
      const currentLab = localStorage.getItem('currentLab')

      // If local storage has value
      if (currentLab) {
        // Check the current lab is All Labs
        if (currentLab === allLabs.lab._id) {
          setAuth((prev) => ({
            ...prev,
            currentLabId: allLabs.lab._id,
            currentLabName: allLabs.lab.labName,
            currentRole: allLabs.role,
          }))
          setIsLoading(false)
          return
        }

        // If the user is admin and the current lab is Admin
        if (isAdmin && currentLab === admin.lab._id) {
          setAuth((prev) => ({
            ...prev,
            currentLabId: admin.lab._id,
            currentLabName: admin.lab.labName,
            currentRole: admin.role,
          }))
          setIsLoading(false)
          return
        }

        // Get the role
        const currentRole = auth.roles.find(
          (role) => role.lab._id === currentLab && role.lab.status === 'In Use'
        )

        // Check the status of the role
        if (currentRole && currentRole.status === 'Active') {
          // Set the current role to auth context
          setAuth((prev) => ({
            ...prev,
            currentLabId: currentRole.lab._id,
            currentLabName: currentRole.lab.labName,
            currentRole: currentRole.role,
          }))
        } else {
          // Set the first lab with active role to local storage and auth context
          localStorage.setItem('currentLab', activeRole.lab._id)
          setAuth((prev) => ({
            ...prev,
            currentLabId: activeRole.lab._id,
            currentLabName: activeRole.lab.labName,
            currentRole: activeRole.role,
          }))
        }
      } else {
        // Set the first lab with active role to local storage and auth context
        localStorage.setItem('currentLab', activeRole.lab._id)
        setAuth((prev) => ({
          ...prev,
          currentLabId: activeRole.lab._id,
          currentLabName: activeRole.lab.labName,
          currentRole: activeRole.role,
        }))
      }

      if (
        pathname === '/complete-your-profile' ||
        pathname === '/profile-update' ||
        pathname === '/pending-approval' ||
        pathname === '/apply-new-lab'
      ) {
        navigate('/')
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
