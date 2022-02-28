import React, { useEffect } from 'react'

const LAB_NAME_REGEX = /^[a-zA-Z0-9.-]+( [a-zA-Z0-9.-]+)*$/

const LabNameField = (props) => {
	useEffect(() => {
		const result = LAB_NAME_REGEX.test(props.value)
		props.setValidated(result && props.value.length >= 2)
	}, [props])

	return (
		<input
			className={`w-full ${
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
	)
}

export default LabNameField
