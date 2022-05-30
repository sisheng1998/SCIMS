import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import ROLES_LIST from '../../../config/roles_list'
import Title from '../components/Title'
import ScanQRCode from '../components/ScanQRCode'
import useMobile from '../../../hooks/useMobile'
import UserInfoCard from '../components/UserInfoCard'
import QuickAccessCard from '../components/QuickAccessCard'
import Overview from './Overview'
import Calendar from './Calendar'
import Chart from './Chart'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()
	const isMobile = useMobile()

	useEffect(() => {
		!isMobile &&
			auth.currentLabId === ROLES_LIST.admin.toString() &&
			navigate('/admin')
	}, [auth.currentLabId, navigate, isMobile])

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState({})

	useEffect(() => {
		if (isMobile) {
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.put(
					'/api/private/dashboard',
					{ labId: auth.currentLabId },
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					setInfo(data.data)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getInfo()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth.currentLabId, isMobile])

	return isMobile ? (
		<>
			<UserInfoCard />
			<QuickAccessCard />
			<ScanQRCode />
		</>
	) : isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Dashboard' hasButton={false} hasRefreshButton={false} />
			<Overview info={info} />

			<div className='mb-6 flex space-x-4'>
				<Calendar chemicals={info.chemicals} dayBeforeExp={info.dayBeforeExp} />
				<Chart info={info} />
			</div>
		</>
	)
}

export default Dashboard
