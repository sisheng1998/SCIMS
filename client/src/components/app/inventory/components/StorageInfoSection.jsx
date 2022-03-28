import React, { useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import UserSearchableSelect from '../../../utils/SearchableSelect'
import STORAGE_GROUPS from '../../../../config/storage_groups'

const StorageInfoSection = ({
	lab,
	users,
	chemical,
	setChemicalData,
	setValidated,
}) => {
	const { auth } = useAuth()

	let initialLocation = ''
	let initialLocationIndex = ''

	if (lab && chemical && chemical.locationId) {
		lab.locations.forEach((location, index) => {
			if (location._id === chemical.locationId) {
				initialLocation = location
				initialLocationIndex = index
			}
		})
	}

	const [ownerId, setOwnerId] = useState(
		chemical ? chemical.owner._id : auth.id
	)
	const [location, setLocation] = useState(initialLocation)
	const [locationIndex, setLocationIndex] = useState(initialLocationIndex)
	const [storageGroup, setStorageGroup] = useState(
		chemical ? chemical.storageGroup : ''
	)

	const today = new Date()
	const [dateIn, setDateIn] = useState(
		chemical && chemical.dateIn
			? new Date(chemical.dateIn).toLocaleDateString('en-CA')
			: today.toLocaleDateString('en-CA')
	)
	const [dateOpen, setDateOpen] = useState(
		chemical && chemical.dateOpen
			? new Date(chemical.dateOpen).toLocaleDateString('en-CA')
			: ''
	)
	const [expirationDate, setExpirationDate] = useState(
		chemical && chemical.expirationDate
			? new Date(chemical.expirationDate).toLocaleDateString('en-CA')
			: ''
	)

	useEffect(() => {
		setChemicalData((prev) => {
			return {
				...prev,
				ownerId,
				locationId: location?._id,
				storageGroup,
				dateIn,
				dateOpen,
				expirationDate,
			}
		})

		setValidated((prev) => {
			return {
				...prev,
				locationValidated: location?._id ? true : false,
				dateInValidated: dateIn ? true : false,
				expirationDateValidated: expirationDate ? true : false,
			}
		})
	}, [
		ownerId,
		location,
		storageGroup,
		setChemicalData,
		setValidated,
		dateIn,
		dateOpen,
		expirationDate,
	])

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
			<div className='mb-6 flex space-x-6'>
				<div className='w-2/3'>
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

			<div className='mb-6 flex space-x-6'>
				<div className='w-1/3'>
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

				<div className='w-1/3'>
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

				<div className='w-1/3'>
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
				<div className='w-1/3'>
					<label htmlFor='dateIn' className='required-input-label'>
						Date In
					</label>
					<input
						className='w-full'
						type='date'
						name='dateIn'
						id='dateIn'
						required
						value={dateIn}
						onChange={(e) => setDateIn(e.target.value)}
					/>
					<p className='mt-2 text-xs text-gray-400'>
						Date of chemical received.
					</p>
				</div>

				<div className='w-1/3'>
					<label htmlFor='dateOpen'>Date Open</label>
					<input
						className='w-full'
						type='date'
						name='dateOpen'
						id='dateOpen'
						value={dateOpen}
						onChange={(e) => setDateOpen(e.target.value)}
					/>
					<p className='mt-2 text-xs text-gray-400'>Date of chemical opened.</p>
				</div>

				<div className='w-1/3'>
					<label htmlFor='expirationDate' className='required-input-label'>
						Expiration Date
					</label>
					<input
						className='w-full'
						type='date'
						name='expirationDate'
						id='expirationDate'
						required
						value={expirationDate}
						onChange={(e) => setExpirationDate(e.target.value)}
					/>
					<p className='mt-2 text-xs text-gray-400'>
						Date of chemical expired.
					</p>
				</div>
			</div>
		</>
	)
}

export default StorageInfoSection
