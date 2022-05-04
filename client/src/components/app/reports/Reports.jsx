import React, { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import Title from '../components/Title'
import ReportsTable from './ReportsTable'

const Reports = () => {
	const { auth } = useAuth()

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState([])
	const [reportType, setReportType] = useState('User Activity')

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.put(
					'/api/private/user-activity',
					{ labId: auth.currentLabId },
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					const processedData = data.data
						.sort((a, b) => (a.date < b.date ? 1 : -1))
						.map((log, index) => {
							return {
								...log,
								type: log.usage !== undefined ? 'Usage' : 'Activity',
								userName: log.user.name,
								userEmail: log.user.email,
								index,
							}
						})

					setInfo(processedData)
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
	}, [axiosPrivate, auth.currentLabId, reportType])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Reports' hasButton={false} hasRefreshButton={false}>
				<div className='flex items-baseline self-end text-sm text-gray-500'>
					<select
						className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-2 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
						name='type'
						id='type'
						style={{ textAlignLast: 'right' }}
						value={reportType}
						onChange={(e) => setReportType(e.target.value)}
					>
						<option value='User Activity'>User Activity</option>
						<option value='Chemical Usage'>Chemical Usage</option>
						<option value='Stock Check'>Stock Check</option>
					</select>
				</div>
			</Title>

			{reportType === 'User Activity' ? (
				<ReportsTable data={info} />
			) : (
				<div className='auth-card mt-6 self-center text-center'>
					<p className='text-lg'>No record yet.</p>
				</div>
			)}
		</>
	)
}

export default Reports
