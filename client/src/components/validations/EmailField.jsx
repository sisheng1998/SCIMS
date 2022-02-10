import React, { useEffect } from 'react'

const EMAIL_REGEX = /^[A-Za-z]+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/

const EmailField = (props) => {
	useEffect(() => {
		const result = EMAIL_REGEX.test(props.value)
		props.setValidated(result)
	}, [props])

	return (
		<div className='mb-6'>
			<input
				className={`w-full ${
					!props.value ? '' : props.validated ? 'input-valid' : 'input-invalid'
				}`}
				type='email'
				id={props.id}
				placeholder={props.placeholder}
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value ? (
					props.message
				) : props.validated ? (
					<span className='text-green-600'>Looks good!</span>
				) : (
					<span className='text-red-600'>Please enter a valid email.</span>
				)}
			</p>
		</div>
	)
}

export default EmailField
