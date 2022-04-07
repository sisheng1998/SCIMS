import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'

const Settings = () => {
	const axiosPrivate = useAxiosPrivate()
	const [settings, setSettings] = useState('')

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

		const getSettings = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/admin/settings', {
					signal: controller.signal,
				})
				if (isMounted) {
					setSettings(data.settings)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getSettings()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, refresh])

	console.log(settings)

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Settings' hasButton={false} hasRefreshButton={false} />
		</>
	)
}

export default Settings
