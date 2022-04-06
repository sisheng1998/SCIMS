import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'
import { ExclamationIcon } from '@heroicons/react/outline'
import ChemicalsTable from './ChemicalsTable'

const Inventory = () => {
	const { auth, setAuth } = useAuth()
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [locations, setLocations] = useState('')
	const [chemicals, setChemicals] = useState([])
	const [disposedChemicals, setDisposedChemicals] = useState([])

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

		const getChemicals = async () => {
			try {
				const { data } = await axiosPrivate.post(
					'/api/private/chemicals',
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					setAuth((prev) => {
						return {
							...prev,
							chemicals: data.data.chemicals,
						}
					})

					if (
						data.data.locations.length !== 0 &&
						data.data.chemicals.length !== 0
					) {
						const processedData = data.data.chemicals.map((chemical, index) => {
							const location = data.data.locations.find(
								(location) => location._id === chemical.locationId
							)

							return {
								...chemical,
								location: location ? location.name : '-',
								index: index,
							}
						})
						setChemicals(processedData)

						if (data.data.disposedChemicals.length !== 0) {
							const disposedData = data.data.disposedChemicals.map(
								(chemical, index) => {
									const location = data.data.locations.find(
										(location) => location._id === chemical.locationId
									)

									return {
										...chemical,
										location: location ? location.name : '-',
										index: index,
									}
								}
							)
							setDisposedChemicals(disposedData)
						}
					}

					setLocations(data.data.locations)
					setIsLoading(false)
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
	}, [axiosPrivate, auth.currentLabId, refresh, setAuth])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			{locations.length === 0 ? (
				<div className='auth-card mt-6 self-center text-center'>
					<ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
					<h2 className='mt-6 mb-2 text-yellow-600'>Lab Setup Required</h2>
					<p>The current lab needs to setup before use.</p>
					<p className='mt-6'>
						{auth.currentRole >= ROLES_LIST.labOwner
							? 'Kindly navigate to settings and define the locations for storing the chemicals.'
							: 'Kindly contact the lab owner to complete the setup for the current lab.'}
					</p>
					{auth.currentRole >= ROLES_LIST.labOwner && (
						<p className='mt-6'>
							Go to <Link to='/settings'>Settings</Link>
						</p>
					)}
				</div>
			) : (
				<>
					<Title
						title='All Chemicals'
						hasButton={auth.currentRole >= ROLES_LIST.postgraduate}
						hasRefreshButton={true}
						buttonText='Add Chemical'
						buttonAction={() => navigate('/inventory/new-chemical')}
						setRefresh={setRefresh}
					/>

					<ChemicalsTable
						data={chemicals}
						locations={locations}
						setUpdateAmountSuccess={setRefresh}
						disposedChemicals={disposedChemicals}
					/>
				</>
			)}
		</>
	)
}

export default Inventory
