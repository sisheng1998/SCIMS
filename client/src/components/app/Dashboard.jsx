import React from 'react'
import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
//import { useNavigate } from 'react-router-dom'
//import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { LogoutIcon } from '@heroicons/react/outline'

import AuthLayout from '../layouts/AuthLayout'

const Dashboard = () => {
	const { auth } = useAuth()
	const logout = useLogout()
	//const navigate = useNavigate()
	//const axiosPrivate = useAxiosPrivate()

	const [active, setActive] = useState('')
	//const [error, setError] = useState('')
	//const [privateData, setPrivateData] = useState('')

	useEffect(() => {
		const currentRole = auth.roles.find((role) => {
			return role.isActive === true
		})

		// Not yet approve by any lab owner
		if (!currentRole) {
			setActive(false)
		} else {
			setActive(true)
		}
	}, [auth])

	/*useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		const fetchPrivateData = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/private', {
					signal: controller.signal,
				})
				isMounted && setPrivateData(data.data)
				setError('')
			} catch (error) {
				navigate('/login')
			}
		}

		fetchPrivateData()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, navigate])*/

	return active ? (
		<>
			<h2 className='mt-60 text-center'>You have the access to the system.</h2>

			<p className='mt-6 text-center'>
				<span
					onClick={logout}
					className='inline-flex cursor-pointer items-center font-semibold text-indigo-600 transition hover:text-indigo-700'
				>
					<LogoutIcon className='mr-1 h-5 w-5' />
					Logout
				</span>
			</p>
		</>
	) : active === '' ? null : (
		<AuthLayout>
			<div className='auth-card mt-8 text-center'>
				<p>Your account status:</p>
				<h2>Pending Approval</h2>
				<p className='mt-6'>Kindly wait for the approval from the lab owner.</p>
			</div>

			<p className='mt-6 text-center'>
				<span
					onClick={logout}
					className='inline-flex cursor-pointer items-center font-semibold text-indigo-600 transition hover:text-indigo-700'
				>
					<LogoutIcon className='mr-1 h-5 w-5' />
					Logout
				</span>
			</p>
		</AuthLayout>
	)
}

export default Dashboard
