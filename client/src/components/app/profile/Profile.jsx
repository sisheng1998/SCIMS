import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import Title from '../components/Title'
import AccountSection from './AccountSection'
import PersonalSection from './PersonalSection'
import LabsSection from './LabsSection'
import FormatDate from '../../utils/FormatDate'

const Profile = () => {
	const axiosPrivate = useAxiosPrivate()
	const [user, setUser] = useState('')
	const [subscriber, setSubscriber] = useState('')

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
					setSubscriber(data.subscriber)
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
				<p className='self-end text-sm text-gray-500 lg:text-xs'>
					Last Updated:{' '}
					<span className='font-semibold'>{FormatDate(user.lastUpdated)}</span>
				</p>
			</Title>

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6 lg:space-y-4'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Account Info</h4>
					<p className='text-sm text-gray-500'>Account email and password.</p>
				</div>

				<div className='w-full max-w-4xl xl:max-w-full'>
					<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
						<AccountSection user={user} subscriber={subscriber} />
					</div>

					<p className='mt-3 text-sm text-gray-500 lg:text-xs'>
						Registered At:{' '}
						<span className='font-semibold'>{FormatDate(user.createdAt)}</span>
					</p>
				</div>
			</div>

			<hr className='mb-6 mt-9 border-gray-200 lg:mb-4 lg:mt-6' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6 lg:space-y-4'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Personal Info</h4>
					<p className='text-sm text-gray-500'>
						This information will be displayed publicly.
					</p>
				</div>

				<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
					<PersonalSection user={user} setRefresh={setRefresh} />
				</div>
			</div>

			<hr className='mb-6 mt-9 border-gray-200 lg:mb-4 lg:mt-6' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6 lg:space-y-4'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Labs Info</h4>
					<p className='text-sm text-gray-500'>
						User role and status in each lab.
					</p>
				</div>

				<LabsSection user={user} />
			</div>

			<hr className='mb-6 border-0' />
		</>
	)
}

export default Profile
