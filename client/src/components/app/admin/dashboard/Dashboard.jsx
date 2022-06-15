import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import Title from '../../components/Title'
import Overview from './Overview'
import Calendar from '../../dashboard/Calendar'
import Chart from '../../dashboard/Chart'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState({})

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/admin/dashboard', {
					signal: controller.signal,
				})
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
	}, [axiosPrivate])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title
				title='Admin Dashboard'
				hasButton={false}
				hasRefreshButton={false}
			/>
			<Overview info={info} />

			<div className='mb-6 flex space-x-4 xl:block xl:space-x-0 xl:space-y-6'>
				<Calendar chemicals={info.chemicals} dayBeforeExp={info.dayBeforeExp} />
				<Chart info={info} />
			</div>
		</>
	)
}

export default Dashboard
