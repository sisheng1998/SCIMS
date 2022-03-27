import React, { useEffect } from 'react'

const CAS_REGEX = /^\b[1-9]{1}[0-9]{1,6}-\d{2}-\d\b$/

const CASField = (props) => {
	useEffect(() => {
		const result = CAS_REGEX.test(props.value)
		props.setValidated(result)
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
				id='CAS'
				placeholder='Enter CAS number'
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value || (!props.showValidated && props.validated) ? (
					<span>Format: XXXXXXX-YY-Z</span>
				) : props.validated ? (
					<span className='text-green-600'>Looks good!</span>
				) : (
					<span className='text-red-600'>Please enter a valid CAS number.</span>
				)}
			</p>
		</div>
	)
}

export default CASField
