import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import LoadingScreen from '../../utils/LoadingScreen'
import LabInfoSection from './LabInfoSection'
import LocationsSection from './LocationsSection'
import StorageGroupsSection from './StorageGroupsSection'
import AddLocationModal from './AddLocationModal'
import FormatDate from '../../utils/FormatDate'

const Settings = () => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [locations, setLocations] = useState('')
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
					const { locations, ...lab } = data.data
					setLab(lab)
					setLocations(locations)
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
			<Title title='Settings' hasButton={false} hasRefreshButton={false}>
				<p className='self-end text-sm text-gray-500'>
					Last Updated:{' '}
					<span className='font-semibold'>{FormatDate(lab.lastUpdated)}</span>
				</p>
			</Title>

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs xl:max-w-full'>
					<h4>Lab Info</h4>
					<p className='text-sm text-gray-500'>Basic information of the lab.</p>
				</div>

				<div className='w-full max-w-4xl xl:max-w-full'>
					<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
						<LabInfoSection lab={lab} />
					</div>

					<p className='mt-3 text-sm text-gray-500'>
						Created At:{' '}
						<span className='font-semibold'>{FormatDate(lab.createdAt)}</span>
					</p>
				</div>
			</div>

			<hr className='mb-6 mt-9 border-gray-200' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Chemical Locations</h4>
					<p className='text-sm text-gray-500'>
						Locations in the lab that store all chemicals.
					</p>
				</div>

				<div className='w-full max-w-4xl xl:max-w-full'>
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

			<hr className='mb-6 mt-9 border-gray-200' />

			<div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs xl:max-w-full'>
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
