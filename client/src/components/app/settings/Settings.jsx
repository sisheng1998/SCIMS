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

	const [lab, setLab] = useState('')
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
					setLab(data.data)
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

			<div className='mx-auto w-full max-w-3xl'>
				<div className='flex items-end justify-between'>
					<h4>Chemical Locations</h4>
					<button
						className='button button-outline'
						onClick={() => setOpenAddLocationModal(true)}
					>
						Add Location
					</button>
				</div>
				<LocationsSection
					locations={lab.locations}
					setEditLocationSuccess={setRefresh}
				/>

				<h4>Storage Groups</h4>
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
