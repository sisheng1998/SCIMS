import React, { useEffect } from 'react'

const EMAIL_REGEX = /^[A-Za-z]+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/

const AltEmailField = (props) => {
	useEffect(() => {
		const result = EMAIL_REGEX.test(props.value)
		props.setValidated(result)
	}, [props])

	return (
		<div className='mb-6'>
			<label htmlFor='altEmail' className='required-input-label'>
				Alternative Email Address
			</label>
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
				id='altEmail'
				placeholder='Enter your personal email'
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value.toLowerCase())}
			/>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value || (!props.showValidated && props.validated) ? (
					<span>Personal email is recommended. (Not used for login)</span>
				) : props.validated ? (
					<span className='text-green-600'>Looks good!</span>
				) : (
					<span className='text-red-600'>
						Please enter a valid email address.
					</span>
				)}
			</p>
		</div>
	)
}

export default AltEmailField
