import React from 'react'
import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
//import { useNavigate } from 'react-router-dom'
//import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { LogoutIcon, ExclamationIcon } from '@heroicons/react/outline'

// Layouts
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'

const Dashboard = () => {
	const { auth, setAuth } = useAuth()
	const logout = useLogout()
	//const navigate = useNavigate()
	//const axiosPrivate = useAxiosPrivate()

	const [active, setActive] = useState('')
	//const [error, setError] = useState('')
	//const [privateData, setPrivateData] = useState('')

	useEffect(() => {
		const currentRole = auth.roles.find((role) => {
			return role.status === 'Active'
		})

		// Not yet approve by any lab owner
		if (!currentRole) {
			setActive(false)
		} else {
			setAuth((prev) => {
				return {
					...prev,
					currentLabId: currentRole.lab._id,
					currentLabName: currentRole.lab.labName,
					currentRole: currentRole.role,
				}
			})
			setActive(true)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
		<AppLayout>
			<>
				<h2 className='mt-6 text-center'>You have the access to the system.</h2>

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
		</AppLayout>
	) : active === '' ? null : (
		<AuthLayout>
			<div className='auth-card mt-8 text-center'>
				<ExclamationIcon className='mx-auto mb-6 h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
				<p>Your account status:</p>
				<h2 className='text-yellow-600'>Pending Approval</h2>
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
