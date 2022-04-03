import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
import { LogoutIcon, ExclamationIcon } from '@heroicons/react/outline'

const PendingApproval = () => {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const { auth } = useAuth()
	const logout = useLogout()

	useEffect(() => {
		const activeRole = auth.roles.find(
			(role) => role.status === 'Active' && role.lab.status === 'In Use'
		)

		setIsLoading(false)

		// Account status is active in any lab
		return activeRole && navigate('/')

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return isLoading ? null : (
		<>
			<div className='auth-card mt-8 text-center'>
				<ExclamationIcon className='mx-auto mb-6 h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
				<p>Your account status:</p>
				<h2 className='text-yellow-600'>Pending Approval</h2>
				<p className='my-6'>Kindly wait for the approval from the lab owner.</p>
				<p className='text-sm'>
					You may <Link to='/apply-new-lab'>apply for other lab</Link> or{' '}
					<Link to='/profile-update'>update your profile</Link>.
				</p>
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
		</>
	)
}

export default PendingApproval
