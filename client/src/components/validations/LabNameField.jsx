import React, { useEffect } from 'react'

const LAB_NAME_REGEX = /^[a-zA-Z0-9.-]+( [a-zA-Z0-9.-]+)*$/

const LabNameField = (props) => {
	useEffect(() => {
		const result = LAB_NAME_REGEX.test(props.value)
		props.setValidated(result)
	}, [props])

	return (
		<div className='flex items-stretch'>
			<p className='flex flex-shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm'>
				Lab
			</p>
			<input
				className={`z-[1] w-full rounded-l-none ${
					!props.value
						? ''
						: props.validated
						? props.showValidated
							? 'input-valid'
							: ''
						: 'input-invalid'
				}`}
				type='text'
				id='labName'
				placeholder='Enter lab name'
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			/>
		</div>
	)
}

export default LabNameField
