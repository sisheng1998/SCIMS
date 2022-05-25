import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../hooks/useAuth'
import LoadingScreen from '../../../utils/LoadingScreen'
import { useParams, Link } from 'react-router-dom'
import { XIcon, ExclamationIcon } from '@heroicons/react/outline'
import ReportDetails from './ReportDetails'
import ReportTable from './ReportTable'

const TabLabels = [
	'Recorded Chemicals',
	'Missing Chemicals',
	'Disposed Chemicals',
]

const StockCheckReport = () => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const params = useParams()

	const [activeTab, setActiveTab] = useState('Tab0')
	const [report, setReport] = useState([])
	const [locations, setLocations] = useState('')

	const [success, setSuccess] = useState('')
	const [notFound, setNotFound] = useState(false)
	const [invalid, setInvalid] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (params.reportId.length !== 12 && params.reportId.length !== 24) {
			setSuccess(false)
			setInvalid(true)
			setNotFound(false)
			setIsLoading(false)
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getReport = async () => {
			try {
				const { data } = await axiosPrivate.put(
					`/api/private/reports/${params.reportId}`,
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					const allChemicals = [
						...data.data.recordedChemicals,
						...data.data.missingChemicals,
						...data.data.disposedChemicals,
					]

					const locations = [
						...new Set(allChemicals.map((chemical) => chemical.location)),
					]

					setLocations(locations)
					setReport(data.data)

					setSuccess(true)
					setIsLoading(false)
				}
			} catch (error) {
				if (error.response?.status === 404) {
					setInvalid(false)
					setNotFound(true)
					setSuccess(false)
					setIsLoading(false)
				}
			}
		}

		getReport()

		return () => {
			isMounted = false
			controller.abort()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params, axiosPrivate])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			{success ? (
				<>
					<Title
						title='Stock Check Report'
						hasButton={false}
						hasRefreshButton={false}
					/>

					<p className='mb-2 font-medium text-gray-500'>Report Overview</p>
					<ReportDetails report={report} />

					<div className='mb-6 border-b border-gray-200 text-sm font-medium text-gray-500'>
						<ul className='-mb-px flex flex-wrap space-x-6'>
							{TabLabels.map((label, index) => (
								<li
									key={index}
									className={`inline-block border-b-2 pb-3 ${
										activeTab === 'Tab' + index
											? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
											: 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-700'
									}`}
									onClick={() => setActiveTab('Tab' + index)}
								>
									{label}
								</li>
							))}
						</ul>
					</div>

					{activeTab === 'Tab0' && (
						<ReportTable
							chemicals={report.recordedChemicals}
							locations={locations}
							type='Recorded'
						/>
					)}

					{activeTab === 'Tab1' && (
						<ReportTable
							chemicals={report.missingChemicals}
							locations={locations}
							type='Missing'
						/>
					)}

					{activeTab === 'Tab2' && (
						<ReportTable
							chemicals={report.disposedChemicals}
							locations={locations}
							type='Disposed'
						/>
					)}
				</>
			) : (
				<>
					{invalid && (
						<div className='auth-card mt-6 self-center text-center'>
							<XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
							<h2 className='mt-6 mb-2 text-red-600'>Invalid Link</h2>
							<p>The link is invalid.</p>
							<p className='mt-6 text-sm'>
								Back to <Link to='/reports'>Reports</Link>
							</p>
						</div>
					)}

					{notFound && (
						<div className='auth-card mt-6 self-center text-center'>
							<ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
							<h2 className='mt-6 mb-2 text-yellow-600'>Report Not Found</h2>
							<p>The report does not exist in this lab.</p>
							<p className='mt-6 text-sm'>
								Back to <Link to='/reports'>Reports</Link>
							</p>
						</div>
					)}
				</>
			)}
		</>
	)
}

export default StockCheckReport