import React, { useEffect } from 'react'

const LabSelectionField = (props) => {
	useEffect(() => {
		props.setValidated(props.value !== '')
	}, [props])

	return (
		<div className='mb-6'>
			<select
				className={`w-full invalid:text-gray-400 ${
					props.validated ? 'input-valid' : ''
				}`}
				id='labSelection'
				required
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			>
				<option value='' className='text-gray-700'>
					Select lab
				</option>
				<option value='Lab 1' className='text-gray-700'>
					Lab 1
				</option>
				<option value='Lab 2' className='text-gray-700'>
					Lab 2
				</option>
				<option value='Lab 3' className='text-gray-700'>
					Lab 3
				</option>
			</select>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value
					? 'The registration request will be sent to the lab owner.'
					: null}
			</p>
		</div>
	)
}

export default LabSelectionField
