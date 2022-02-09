import React, { useEffect } from 'react'

const NAME_REGEX = /^[a-zA-z]+([\s][a-zA-Z]+)*$/

const NameField = (props) => {
	useEffect(() => {
		const result = NAME_REGEX.test(props.value)
		props.setValidated(result && props.value.length > 2)
	}, [props])

	return (
		<div className='mb-6'>
			<input
				className={`w-full ${
					!props.value ? '' : props.validated ? 'input-valid' : 'input-invalid'
				}`}
				type='text'
				id={props.id}
				placeholder={props.placeholder}
				required={props.required || false}
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value ? (
					<span>Only alphabets and spaces are allowed.</span>
				) : props.validated ? null : (
					<span className='text-red-600'>Please enter a valid name.</span>
				)}
			</p>
		</div>
	)
}

export default NameField
