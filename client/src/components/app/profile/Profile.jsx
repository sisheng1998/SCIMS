import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../others/LoadingScreen'
import Title from '../components/Title'
import AccountSection from './AccountSection'
import PersonalSection from './PersonalSection'
import LabsSection from './LabsSection'

const Profile = () => {
	const axiosPrivate = useAxiosPrivate()
	const [user, setUser] = useState('')

	const [isLoading, setIsLoading] = useState(true)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) {
			setRefresh(false)
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getUserProfile = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/private/profile', {
					signal: controller.signal,
				})
				if (isMounted) {
					setUser(data.user)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getUserProfile()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, refresh])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Profile' hasButton={false} hasRefreshButton={false} />
			<hr className='mb-12 border-gray-200' />

			<div className='mx-auto w-full max-w-3xl'>
				<h4>Account Info</h4>
				<AccountSection user={user} setRefresh={setRefresh} />

				<h4>Personal Info</h4>
				<PersonalSection user={user} setRefresh={setRefresh} />

				<h4>Labs Info</h4>
				<LabsSection user={user} />
			</div>
		</>
	)
}

export default Profile
