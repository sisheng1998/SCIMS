import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import LoadingScreen from '../../utils/LoadingScreen'
import { useLocation, useParams, Link } from 'react-router-dom'
import EditChemicalInfo from './EditChemicalInfo'
import ViewChemicalInfo from './ViewChemicalInfo'
import FormatDate from '../../utils/FormatDate'
import { ExclamationIcon } from '@heroicons/react/outline'

const ChemicalInfo = () => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const params = useParams()
	const { state } = useLocation()
	const { edit } = state || { edit: false }

	const [isEdit, setIsEdit] = useState(edit)
	const [chemical, setChemical] = useState('')
	const [labData, setLabData] = useState('')

	const [success, setSuccess] = useState('')
	const [notFound, setNotFound] = useState(false)
	const [unauthorized, setUnauthorized] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (params.chemicalId.length !== 12 && params.chemicalId.length !== 24) {
			setSuccess(false)
			setNotFound(true)
			setUnauthorized(false)
			setIsLoading(false)
			return
		}

		if (refresh) {
			setRefresh(false)
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getChemicalInfo = async () => {
			try {
				const { data } = await axiosPrivate.put(
					`/api/private/chemical/${params.chemicalId}`,
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					const { lab, ...chemicalInfo } = data.data
					setChemical(chemicalInfo)
					setLabData(lab)

					const currentUser = auth.roles.find(
						(role) =>
							role.lab._id === lab._id &&
							role.lab.status === 'In Use' &&
							role.status === 'Active'
					)

					if (currentUser) {
						setSuccess(true)
					} else {
						setUnauthorized(true)
						setNotFound(false)
						setSuccess(false)
					}
					setIsLoading(false)
				}
			} catch (error) {
				if (error.response?.status === 404) {
					setNotFound(true)
					setSuccess(false)
				}
			}
		}

		getChemicalInfo()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [params, axiosPrivate, auth.currentLabId, auth.roles, refresh])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			{success ? (
				<>
					<Title title='Chemical' hasButton={false} hasRefreshButton={false}>
						<p className='self-end text-sm text-gray-500'>
							Last Updated:{' '}
							<span className='font-semibold'>
								{FormatDate(chemical.lastUpdated)}
							</span>
						</p>
					</Title>

					{isEdit ? (
						<EditChemicalInfo
							chemical={chemical}
							labData={labData}
							setEditSuccess={setRefresh}
							setEdit={setIsEdit}
						/>
					) : (
						<ViewChemicalInfo
							chemical={chemical}
							lab={labData}
							setUpdateSuccess={setRefresh}
							setEdit={setIsEdit}
						/>
					)}
				</>
			) : (
				<>
					{notFound && (
						<div className='auth-card mt-6 self-center text-center'>
							<ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
							<h2 className='mt-6 mb-2 text-yellow-600'>Chemical Not Found</h2>
							<p>The chemical does not exist in any lab.</p>
							<p className='mt-6 text-sm'>
								Back to <Link to='/inventory'>Inventory</Link>
							</p>
						</div>
					)}

					{unauthorized && (
						<div className='auth-card mt-6 max-w-xl self-center'>
							<ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
							<h2 className='mt-6 mb-2 text-center text-yellow-600'>
								Unauthorized
							</h2>
							<p className='text-center'>
								You are not allowed to view the details of the chemical.
							</p>

							<div className='my-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
								<h4>Chemical Info</h4>
								<p className='text-sm text-gray-500'>
									Some information of the chemical.
								</p>

								<hr className='mb-6 mt-4 border-gray-200' />

								<div className='mb-6 flex space-x-6'>
									<div className='flex-1'>
										<label htmlFor='CAS' className='mb-0.5 text-gray-500'>
											CAS No.
										</label>
										<p className='font-medium'>{chemical.CAS}</p>
									</div>

									<div className='flex-1'>
										<label htmlFor='name' className='mb-0.5 text-gray-500'>
											Name of Chemical
										</label>
										<p className='font-medium'>{chemical.name}</p>
									</div>
								</div>

								<div className='flex space-x-6'>
									<div className='flex-1'>
										<label htmlFor='lab' className='mb-0.5 text-gray-500'>
											Lab
										</label>
										<p className='font-medium'>{'Lab ' + labData.labName}</p>
									</div>

									<div className='flex-1'>
										<label htmlFor='labOwner' className='mb-0.5 text-gray-500'>
											Lab Owner
										</label>
										<p className='font-medium'>{labData.labOwner.name}</p>
									</div>
								</div>
							</div>

							<p className='text-sm text-gray-500'>
								To view the details of the chemical, you need to:
							</p>
							<ol className='mb-6 ml-4 list-decimal text-sm'>
								<li>
									<span className='font-semibold'>Apply for the lab</span> and{' '}
									<span className='font-semibold'>get the approval</span> from
									the lab owner.
								</li>
								<li>
									Have at least{' '}
									<span className='font-semibold'>user role of 'Guest'</span>{' '}
									with the{' '}
									<span className='font-semibold'>status of 'Active'</span> for
									the lab.
								</li>
							</ol>

							<p className='text-center text-sm'>
								Back to <Link to='/inventory'>Inventory</Link> or{' '}
								<Link to='/labs'>Apply New Lab</Link>
							</p>
						</div>
					)}
				</>
			)}
		</>
	)
}

export default ChemicalInfo
