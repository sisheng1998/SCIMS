import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'
import {
	LogoutIcon,
	CheckIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import LabSelectionField from '../validations/LabSelectionField'
import LoadingScreen from '../utils/LoadingScreen'

const PendingApproval = () => {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const { auth } = useAuth()
	const logout = useLogout()

	const email = auth.email
	const [labId, setLabId] = useState('')
	const [labValidated, setLabValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		const activeRole = auth.roles.find(
			(role) => role.status === 'Active' && role.lab.status === 'In Use'
		)

		setIsLoading(false)

		// Account status is active in any lab
		return activeRole && navigate('/')

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setAllowed(labValidated)
	}, [labValidated])

	const applyNewLabHandler = async (e) => {
		e.preventDefault()

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			await axios.put('/api/auth/apply-new-lab', { email, labId }, config)
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	return isLoading ? (
		<div className='auth-card mt-8'>
			<LoadingScreen />
		</div>
	) : (
		<>
			{success ? null : <h1 className='my-6 text-center'>Apply New Lab</h1>}

			<div className={`auth-card ${success ? 'mt-8 text-center' : ''}`}>
				{success ? (
					<>
						<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
						<h2 className='mt-6 mb-2 text-green-600'>Request Sent!</h2>
						<p>The request has been sent.</p>
						<p className='mt-6'>
							You will be able to interact with the system after your request is
							approved.
						</p>
					</>
				) : (
					<>
						{errorMessage && (
							<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
								<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
								{errorMessage}
							</p>
						)}

						<form
							onSubmit={applyNewLabHandler}
							spellCheck='false'
							autoComplete='off'
						>
							<label htmlFor='labSelection' className='required-input-label'>
								Lab
							</label>
							<LabSelectionField
								checkExist={true}
								userRoles={auth.roles}
								value={labId}
								setValue={setLabId}
								validated={labValidated}
								setValidated={setLabValidated}
							/>

							<button className='mt-3 w-full' type='submit' disabled={!allowed}>
								Send Request
							</button>
						</form>
					</>
				)}
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
