import React, { useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import UserSearchableSelect from '../../../utils/SearchableSelect'
import STORAGE_GROUPS from '../../../../config/storage_groups'

const StorageInfoSection = ({ lab, users, setChemicalData, setValidated }) => {
	const { auth } = useAuth()

	const [ownerId, setOwnerId] = useState(auth.id)
	const [location, setLocation] = useState('')
	const [locationIndex, setLocationIndex] = useState('')
	const [storageGroup, setStorageGroup] = useState('')

	useEffect(() => {
		setChemicalData((prev) => {
			return { ...prev, ownerId, locationId: location?._id, storageGroup }
		})

		setValidated((prev) => {
			return {
				...prev,
				locationValidated: location?._id ? true : false,
			}
		})
	}, [ownerId, location, storageGroup, setChemicalData, setValidated])

	const locationChangeHandler = (e) => {
		setStorageGroup('')
		setLocationIndex(e.target.value)

		if (e.target.value !== '') {
			setLocation(lab.locations[e.target.value])
		} else {
			setLocation('')
		}
	}

	return (
		<>
			<div className='flex space-x-6'>
				<div className='mb-6 w-1/3'>
					<label htmlFor='lab'>Lab</label>
					<input
						className='w-full'
						type='text'
						name='lab'
						id='lab'
						readOnly
						value={'Lab ' + lab.labName}
					/>
					<p className='mt-2 text-xs text-gray-400'>
						Lab that storing the chemical.
					</p>
				</div>

				<div className='mb-6 w-1/3'>
					<label htmlFor='locationSelection' className='required-input-label'>
						Location
					</label>
					<select
						className='w-full'
						id='locationSelection'
						required
						value={locationIndex}
						onChange={locationChangeHandler}
					>
						<option value=''>Select</option>
						{lab.locations
							.sort((a, b) =>
								a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
							)
							.map((location, index) => (
								<option key={location._id} value={index}>
									{location.name}
								</option>
							))}
					</select>
					<p className='mt-2 text-xs text-gray-400'>
						Location for the chemical.
					</p>
				</div>

				<div className='mb-6 w-1/3'>
					<label htmlFor='storageGroupSelection'>Storage Group</label>
					<select
						className='w-full'
						id='storageGroupSelection'
						value={storageGroup}
						onChange={(e) => setStorageGroup(e.target.value)}
					>
						<option value=''>Select</option>
						{location &&
							STORAGE_GROUPS.filter((group) =>
								location.storageGroups.includes(group.code)
							).map((group, index) => (
								<option key={index} value={group.code}>
									{group.code} - {group.description}
								</option>
							))}
					</select>
					<p className='mt-2 text-xs text-gray-400'>
						The chemical storage group.
					</p>
				</div>
			</div>

			<div className='flex space-x-6'>
				<div className='mb-6 w-3/4'>
					<label htmlFor='userSelection' className='required-input-label'>
						Owner
					</label>
					<UserSearchableSelect
						selectedId={ownerId}
						setSelectedId={setOwnerId}
						options={users}
					/>
					<p className='mt-2 text-xs text-gray-400'>Owner of the chemical.</p>
				</div>
			</div>
		</>
	)
}

export default StorageInfoSection
