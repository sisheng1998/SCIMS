import React, { useEffect, useState } from 'react'

const USM_EMAIL_REGEX = /^[A-Za-z]+([.-]?\w+)*@(?:[a-zA-Z]+\.)?usm\.my$/

const USMEmailField = (props) => {
	const [emailExisted, setEmailExisted] = useState(false)

	useEffect(() => {
		const result = USM_EMAIL_REGEX.test(props.value)

		if (
			result &&
			props.checkExist &&
			props.existingEmails.some((e) => e.email === props.value)
		) {
			setEmailExisted(true)
			props.setValidated(false)
		} else if (
			result &&
			props.excludeStudent &&
			props.value.toLowerCase().indexOf('@student.usm.my') !== -1
		) {
			props.setValidated(false)
		} else {
			setEmailExisted(false)
			props.setValidated(result)
		}
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
				type='email'
				id='email'
				placeholder={props.placeholder || 'Enter your email'}
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value.toLowerCase())}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value || (!props.showValidated && props.validated) ? (
					props.message
				) : props.validated ? (
					<span className='text-green-600'>{props.successMessage}</span>
				) : (
					<span className='text-red-600'>
						{emailExisted
							? 'An account with this email already exists.'
							: 'Please enter a valid USM email.'}
					</span>
				)}
			</p>
		</div>
	)
}

export default USMEmailField
