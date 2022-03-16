import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../others/LoadingScreen'
import Title from '../components/Title'
import AccountSection from './AccountSection'
import PersonalSection from './PersonalSection'
import LabsSection from './LabsSection'
import FormatDate from '../../others/FormatDate'

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
			<Title title='Profile' hasButton={false} hasRefreshButton={false}>
				<p className='self-end text-sm text-gray-500'>
					Last Updated:{' '}
					<span className='font-semibold'>{FormatDate(user.lastUpdated)}</span>
				</p>
			</Title>

			<div className='mx-auto w-full max-w-3xl'>
				<h4>Account Info</h4>
				<AccountSection user={user} setRefresh={setRefresh} />
				<p className='mb-12 text-sm text-gray-500'>
					Registered At:{' '}
					<span className='font-semibold'>{FormatDate(user.registeredAt)}</span>
				</p>

				<h4>Personal Info</h4>
				<PersonalSection user={user} setRefresh={setRefresh} />

				<h4>Labs Info</h4>
				<LabsSection user={user} />
			</div>
		</>
	)
}

export default Profile
