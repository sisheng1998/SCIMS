import React, { useEffect } from 'react'

const MATRIC_REGEX = /^[a-zA-Z0-9-_/()]*$/

const MatricNoField = (props) => {
	useEffect(() => {
		const result = MATRIC_REGEX.test(props.value)
		props.setValidated(result && props.value.length >= 6)
	}, [props])

	return (
		<div className='mb-6'>
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
				id='matricNo'
				placeholder={props.placeholder}
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value || (!props.showValidated && props.validated) ? (
					<span>Matric number or staff number is required.</span>
				) : props.validated ? (
					<span className='text-green-600'>Looks good!</span>
				) : (
					<span className='text-red-600'>
						Please enter a valid matric number or staff number.
					</span>
				)}
			</p>
		</div>
	)
}

export default MatricNoField
