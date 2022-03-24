import React, { useEffect } from 'react'

const NUMBER_REGEX = /^\d{1,}(\.\d{1})?$/

const NumberWithUnitField = (props) => {
	useEffect(() => {
		const result = NUMBER_REGEX.test(props.value)
		props.setValidated(result)
	}, [props])

	return (
		<>
			<div className='flex items-stretch'>
				<input
					className={`z-[1] w-full rounded-r-none ${
						!props.value
							? ''
							: props.validated
							? props.showValidated
								? 'input-valid'
								: ''
							: 'input-invalid'
					}`}
					type='number'
					min='0.0'
					step='0.1'
					id={props.id}
					placeholder={props.placeholder}
					required={props.required || false}
					value={props.value}
					onChange={(e) => props.setValue(e.target.value)}
				/>
				<p className='flex w-10 flex-shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm'>
					{props.unit === '' ? '-' : props.unit}
				</p>
			</div>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value || (!props.showValidated && props.validated) ? (
					props.message || 'Numbers with 1 decimal place only.'
				) : props.validated ? (
					<span className='text-green-600'>Looks good!</span>
				) : (
					<span className='text-red-600'>Please enter a valid number.</span>
				)}
			</p>
		</>
	)
}

export default NumberWithUnitField
