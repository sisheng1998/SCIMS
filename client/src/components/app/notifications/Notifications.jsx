import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import useAuth from '../../../hooks/useAuth'
import dayjs from 'dayjs'
import NotificationsLoop from './NotificationsLoop'
import NoNotification from './NoNotification'

const Notifications = () => {
	const axiosPrivate = useAxiosPrivate()
	const { setAuth } = useAuth()

	const [notificationsToday, setNotificationsToday] = useState([])
	const [pastNotifications, setPastNotifications] = useState([])

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getNotifications = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/private/notifications', {
					signal: controller.signal,
				})

				if (isMounted) {
					const { today, past } = data.data.reduce(
						(acc, notification) => {
							dayjs(notification.date).format('DD-MM-YY') ===
							dayjs().format('DD-MM-YY')
								? acc.today.push(notification)
								: acc.past.push(notification)
							return acc
						},
						{ today: [], past: [] }
					)

					setNotificationsToday(today)
					setPastNotifications(past)

					setAuth((prev) => {
						return {
							...prev,
							notification: false,
						}
					})
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
	}, [axiosPrivate, setAuth])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<div className='mb-6 w-full max-w-2xl self-center'>
			<Title title='Notifications' hasButton={false} hasRefreshButton={false} />

			{notificationsToday.length === 0 && pastNotifications.length === 0 ? (
				<NoNotification />
			) : (
				<>
					<p className='mb-2 font-medium text-gray-500'>Today</p>
					<NotificationsLoop notifications={notificationsToday} />

					<p className='mb-2 mt-6 font-medium text-gray-500'>Past</p>
					<NotificationsLoop notifications={pastNotifications} />
				</>
			)}
		</div>
	)
}

export default Notifications
