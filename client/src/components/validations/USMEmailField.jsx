import React, { useEffect } from 'react'

const USM_EMAIL_REGEX = /^[A-Za-z]+([.-]?\w+)*@(?:[a-zA-Z]+\.)?usm\.my$/

const USMEmailField = (props) => {
	useEffect(() => {
		const result = USM_EMAIL_REGEX.test(props.value)
		props.setValidated(result)
	}, [props])

	return (
		<div className='mb-6'>
			<input
				className={`w-full ${
					!props.value ? '' : props.validated ? 'input-valid' : 'input-invalid'
				}`}
				type='email'
				id='email'
				placeholder='Enter your email'
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value ? (
					props.message
				) : props.validated ? null : (
					<span className='text-red-600'>Please enter a valid USM email.</span>
				)}
			</p>
		</div>
	)
}

export default USMEmailField
