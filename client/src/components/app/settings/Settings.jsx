import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'
import LocationsSection from './LocationsSection'
import StorageGroupsSection from './StorageGroupsSection'
import AddLocationModal from './AddLocationModal'

const Settings = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId === ROLES_LIST.admin.toString() &&
			navigate('/admin/settings')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()

	const [locations, setLocations] = useState('')
	const [openAddLocationModal, setOpenAddLocationModal] = useState(false)

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

		const getLocations = async () => {
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
					setLocations(data.data.locations)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getLocations()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth.currentLabId, refresh])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Settings' hasButton={false} hasRefreshButton={false} />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Chemical Locations</h4>
					<p className='text-sm text-gray-500'>
						Locations in the lab that store all chemicals.
					</p>
				</div>

				<div className='mb-9 w-full max-w-3xl'>
					<LocationsSection
						locations={locations}
						setEditLocationSuccess={setRefresh}
					/>

					<button
						className='button button-outline mt-3'
						onClick={() => setOpenAddLocationModal(true)}
					>
						Add Location
					</button>
				</div>
			</div>

			<hr className='mb-6 border-gray-200' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Storage Groups</h4>
					<p className='text-sm text-gray-500'>
						A group of chemicals that will not react violently if&nbsp;mixed.
					</p>
				</div>

				<StorageGroupsSection />
			</div>

			{openAddLocationModal && (
				<AddLocationModal
					openModal={openAddLocationModal}
					setOpenModal={setOpenAddLocationModal}
					setAddLocationSuccess={setRefresh}
				/>
			)}
		</>
	)
}

export default Settings
