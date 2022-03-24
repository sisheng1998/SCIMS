import React, { useState } from 'react'
import STORAGE_GROUPS from '../../config/storage_groups'

const StorageGroupsField = ({ value, setValue }) => {
	const [selectAllChecked, setSelectAllChecked] = useState(
		STORAGE_GROUPS.length === value.length
	)

	const initialCheckedState =
		value.length === 0
			? Array(STORAGE_GROUPS.length).fill(false)
			: () => STORAGE_GROUPS.map((group) => value.includes(group.code))

	const [checkedState, setCheckedState] = useState(initialCheckedState)

	const selectAllHandler = () => {
		if (selectAllChecked) {
			setCheckedState(Array(STORAGE_GROUPS.length).fill(false))
			setValue([])
		} else {
			setCheckedState(Array(STORAGE_GROUPS.length).fill(true))
			setValue(STORAGE_GROUPS.map((group) => group.code))
		}

		setSelectAllChecked(!selectAllChecked)
	}

	const onChangeHandler = (e, position) => {
		if (selectAllChecked) {
			setSelectAllChecked(false)
		}

		const updatedCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		)

		setCheckedState(updatedCheckedState)

		var updatedValues = [...value]
		if (e.target.checked) {
			updatedValues = [...value, e.target.value]
		} else {
			updatedValues.splice(value.indexOf(e.target.value), 1)
		}

		if (!selectAllChecked && updatedValues.length === STORAGE_GROUPS.length) {
			setSelectAllChecked(true)
		}

		setValue(updatedValues.sort())
	}

	return (
		<div className='mb-6'>
			<div className='mb-1 flex items-center'>
				<input
					className='cursor-pointer'
					type='checkbox'
					id='All'
					value='All'
					onChange={selectAllHandler}
					checked={selectAllChecked}
				/>
				<label className='mb-0 cursor-pointer pl-2 font-normal' htmlFor='All'>
					All storage groups
				</label>
			</div>

			{STORAGE_GROUPS.map((group, index) => (
				<div key={index} className='mb-1 flex items-center'>
					<input
						className='cursor-pointer'
						type='checkbox'
						id={group.code}
						value={group.code}
						checked={checkedState[index]}
						onChange={(e) => onChangeHandler(e, index)}
					/>
					<label
						className='mb-0 cursor-pointer pl-2 font-normal'
						htmlFor={group.code}
					>
						{group.code} - {group.description}
					</label>
				</div>
			))}

			<p className='text-xs text-gray-400'>
				Assign selected storage group(s) to the location.
			</p>
		</div>
	)
}

export default StorageGroupsField
