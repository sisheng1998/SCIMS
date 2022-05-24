import React, { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import Title from '../components/Title'
import StockCheckTable from './stock-check/StockCheckTable'

const Reports = () => {
	const { auth } = useAuth()

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState([])
	const [reportType, setReportType] = useState('Chemical Usage')

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				if (reportType === 'Chemical Usage') {
					setTimeout(() => setIsLoading(false), 500)
				} else {
					const { data } = await axiosPrivate.put(
						'/api/private/stock-check-reports',
						{ labId: auth.currentLabId },
						{
							signal: controller.signal,
						}
					)
					if (isMounted) {
						const processedData = data.data
							.sort((a, b) => (a.date < b.date ? 1 : -1))
							.map((report, index) => ({
								index,
								_id: report._id,
								recordedNo: report.recordedChemicals.length,
								missingNo: report.missingChemicals.length,
								disposedNo: report.disposedChemicals.length,
								totalNo:
									report.recordedChemicals.length +
									report.missingChemicals.length +
									report.disposedChemicals.length,
								date: report.date,
							}))

						setInfo(processedData)
						setIsLoading(false)
					}
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
			<Title
				title={reportType + ' Reports'}
				hasButton={false}
				hasRefreshButton={false}
			>
				<div className='flex items-baseline self-end text-sm text-gray-500'>
					<select
						className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-2 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
						name='type'
						id='type'
						style={{ textAlignLast: 'right' }}
						value={reportType}
						onChange={(e) => setReportType(e.target.value)}
					>
						<option value='Chemical Usage'>Chemical Usage</option>
						<option value='Stock Check'>Stock Check</option>
					</select>
				</div>
			</Title>

			{reportType === 'Chemical Usage' ? (
				<div className='auth-card self-center text-center'>
					<p className='text-lg'>No record yet.</p>
				</div>
			) : (
				<StockCheckTable data={info} />
			)}
		</>
	)
}

export default Reports
