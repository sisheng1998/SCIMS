import React, { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import Title from '../components/Title'
import ImportSection from './ImportSection'
import ExportSection from './ExportSection'

const ImportExport = () => {
	const { auth } = useAuth()

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(false)
	const [chemicals, setChemicals] = useState([])
	const [type, setType] = useState('Import')

	useEffect(() => {
		if (type === 'Import') {
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getChemicals = async () => {
			try {
				/*const { data } = await axiosPrivate.put(
					'/api/private/dashboard',
					{ labId: auth.currentLabId, days },
					{
						signal: controller.signal,
					}
				)*/
				if (isMounted) {
					setChemicals([])
					setTimeout(() => setIsLoading(false), 500)
				}
			} catch (error) {
				return
			}
		}

		getChemicals()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth.currentLabId, type])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title={type} hasButton={false} hasRefreshButton={false}>
				<div className='flex items-baseline self-end text-sm text-gray-500'>
					<select
						className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-2 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
						name='type'
						id='type'
						style={{ textAlignLast: 'right' }}
						value={type}
						onChange={(e) => setType(e.target.value)}
					>
						<option value='Import'>Import</option>
						<option value='Export'>Export</option>
					</select>
				</div>
			</Title>

			{type === 'Import' ? (
				<div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md space-y-2 font-medium text-gray-400 2xl:max-w-xs xl:max-w-full'>
						<p className='text-lg font-semibold text-indigo-600'>
							Upload CSV File
						</p>
						<p className=''>Column Mapping</p>
						<p className=''>Import</p>
						<p className=''>Done!</p>
					</div>

					<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
						<ImportSection />
					</div>
				</div>
			) : (
				<div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md space-y-2 font-medium text-gray-400 2xl:max-w-xs xl:max-w-full'>
						<p className='text-lg font-semibold text-indigo-600'>
							Select Columns
						</p>
						<p className=''>Export</p>
						<p className=''>Done!</p>
					</div>
					<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
						<ExportSection chemicals={chemicals} />
					</div>
				</div>
			)}
		</>
	)
}

export default ImportExport
