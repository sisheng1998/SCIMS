import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import useAuth from '../../../hooks/useAuth'

const Notification = () => {
	const axiosPrivate = useAxiosPrivate()
	const { auth } = useAuth()
	const [notifications, setNotifications] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getNotifications = async () => {
			try {
				/*const { data } = await axiosPrivate.post(
					'/api/private/notifications',
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)*/
				if (isMounted) {
					setNotifications('')
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getNotifications()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth.currentLabId])

	return isLoading ? (
		<LoadingScreen />
	) : !notifications && false ? (
		<div className='auth-card mt-6 self-center text-center'>
			<h4 className='text-gray-500'>No notification yet.</h4>
		</div>
	) : (
		<>
			{false && (
				<Title
					title='Notifications'
					hasButton={false}
					hasRefreshButton={false}
				/>
			)}
		</>
	)
}

export default Notification
