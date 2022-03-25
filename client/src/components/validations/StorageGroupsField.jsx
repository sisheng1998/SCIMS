import React, { useState } from 'react'
import STORAGE_GROUPS from '../../config/storage_groups'

const StorageGroupsField = ({ value, setValue }) => {
	const [anyChecked, setAnyChecked] = useState(
		STORAGE_GROUPS.length === value.length
	)

	const initialCheckedState =
		value.length === 0
			? Array(STORAGE_GROUPS.length).fill(false)
			: anyChecked
			? Array(STORAGE_GROUPS.length).fill(false)
			: () => STORAGE_GROUPS.map((group) => value.includes(group.code))

	const [checkedState, setCheckedState] = useState(initialCheckedState)
	const [allowed, setAllowed] = useState('')

	const anyOnChangeHandler = () => {
		setCheckedState(Array(STORAGE_GROUPS.length).fill(false))

		if (anyChecked) {
			setValue([])
			setAllowed('')
		} else {
			setValue(STORAGE_GROUPS.map((group) => group.code))
		}

		setAnyChecked(!anyChecked)
	}

	const onChangeHandler = (e, position) => {
		const updatedCheckedState = checkedState.map((checked, index) =>
			index === position ? !checked : checked
		)

		setCheckedState(updatedCheckedState)

		let updatedValues = [...value]
		e.target.checked
			? (updatedValues = [...value, e.target.value])
			: updatedValues.splice(value.indexOf(e.target.value), 1)

		setValue(updatedValues.sort())

		setAllowedOptions(updatedCheckedState, updatedValues)
	}

	const setAllowedOptions = (updatedCheckedState, updatedValues) => {
		let allowedOptions = []

		updatedValues.length === 0
			? (allowedOptions = '')
			: updatedCheckedState.forEach((checked, index) => {
					if (
						checked &&
						allowedOptions.join('') !== STORAGE_GROUPS[index].allowed.join('')
					) {
						if (allowedOptions.length === 0) {
							allowedOptions = STORAGE_GROUPS[index].allowed
						} else {
							allowedOptions = [
								...allowedOptions,
								...STORAGE_GROUPS[index].allowed,
							]

							const uniqueElements = new Set(allowedOptions)

							const filteredElements = allowedOptions.filter((item) => {
								if (uniqueElements.has(item)) {
									uniqueElements.delete(item)
									return ''
								} else {
									return item
								}
							})

							allowedOptions = [...new Set(filteredElements)]
						}
					}
			  })

		setAllowed(allowedOptions)
	}

	return (
		<div className='mb-6'>
			<div className='mb-1 flex items-center'>
				<input
					className='cursor-pointer'
					type='checkbox'
					id='any'
					value='any'
					onChange={anyOnChangeHandler}
					checked={anyChecked}
				/>
				<label className='mb-0 cursor-pointer pl-2 font-normal' htmlFor='any'>
					Any Storage Groups
				</label>
			</div>

			<div className='grid gap-1'>
				{STORAGE_GROUPS.map((group, index) => (
					<div
						key={index}
						className={`flex items-center ${
							anyChecked || (allowed && !allowed.includes(group.code))
								? 'pointer-events-none opacity-50'
								: ''
						}`}
					>
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
			</div>

			<p className='mt-2 text-xs text-gray-400'>
				Assign selected storage group(s) to the location.
			</p>
		</div>
	)
}

export default StorageGroupsField
