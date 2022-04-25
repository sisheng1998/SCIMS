import React, { useState, useEffect } from 'react'
import { COC_DESCRIPTION } from '../../config/safety_security_list'
import { InformationCircleIcon } from '@heroicons/react/outline'

const SafetySecurityField = ({ lists, value, setValue, isCOC }) => {
	const [checkedState, setCheckedState] = useState(
		Array(lists.length).fill(false)
	)

	useEffect(() => {
		const updatedCheckedState =
			value.length === 0
				? Array(lists.length).fill(false)
				: () => lists.map((list) => (value.includes(list) ? true : false))
		setCheckedState(updatedCheckedState)
	}, [lists, value])

	const onChangeHandler = (e, position) => {
		const updatedCheckedState = checkedState.map((checked, index) =>
			index === position ? !checked : checked
		)

		setCheckedState(updatedCheckedState)

		let updatedValues = [...value]
		e.target.checked
			? (updatedValues = [...value, e.target.value])
			: updatedValues.splice(value.indexOf(e.target.value), 1)

		setValue(updatedValues)
	}

	return (
		<div className='grid grid-cols-3 gap-1'>
			{lists.map((list, index) => (
				<div key={index} className='flex items-center'>
					<input
						className='cursor-pointer'
						type='checkbox'
						id={list === 'Other' ? list + index : list.replace(/\W/g, '')}
						value={list}
						checked={checkedState[index]}
						onChange={(e) => onChangeHandler(e, index)}
					/>
					<label
						className='mb-0 cursor-pointer pl-2 font-normal'
						htmlFor={list === 'Other' ? list + index : list.replace(/\W/g, '')}
					>
						{list}
						{isCOC && list !== 'Other' && (
							<span
								className='tooltip ml-1.5'
								data-tooltip={COC_DESCRIPTION[index]}
							>
								<InformationCircleIcon className='inline-block h-3.5 w-3.5 -translate-y-0.5 stroke-2 text-gray-400' />
							</span>
						)}
					</label>
				</div>
			))}
		</div>
	)
}

export default SafetySecurityField
