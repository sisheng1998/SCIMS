import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'
import { useParams, Link } from 'react-router-dom'
import EditChemicalInfo from './EditChemicalInfo'
import FormatDate from '../../utils/FormatDate'
import { ExclamationIcon } from '@heroicons/react/outline'

const ChemicalInfo = () => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const params = useParams()

	const [chemical, setChemical] = useState('')
	const [labData, setLabData] = useState('')
	const [usersData, setUsersData] = useState('')

	const [success, setSuccess] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (params.chemicalId.length !== 12 && params.chemicalId.length !== 24) {
			setSuccess(false)
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

					lab.labUsers.unshift(lab.labOwner)
					const processedUsersData = lab.labUsers
						.map((user) => {
							const currentRole = user.roles.find((role) => {
								return role.lab === lab._id
							})

							return {
								...user,
								roleValue: currentRole.role,
								status: currentRole.status,
							}
						})
						.filter(
							(user) =>
								user.isEmailVerified &&
								user.roleValue !== ROLES_LIST.guest &&
								user.status === 'Active'
						)
					// LabUsers array
					setUsersData(processedUsersData)

					setSuccess(true)
					setIsLoading(false)
				}
			} catch (error) {
				setSuccess(false)
				setIsLoading(false)
			}
		}

		getChemicalInfo()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [params, axiosPrivate, auth.currentLabId, refresh])

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

					<EditChemicalInfo
						chemical={chemical}
						labData={labData}
						usersData={usersData}
					/>
				</>
			) : (
				<div className='auth-card mt-6 self-center text-center'>
					<ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
					<h2 className='mt-6 mb-2 text-yellow-600'>Chemical Not Found</h2>
					<p>The chemical does not exist in the current lab.</p>
					<p className='mt-6'>
						Back to <Link to='/inventory'>Inventory</Link>
					</p>
				</div>
			)}
		</>
	)
}

export default ChemicalInfo
