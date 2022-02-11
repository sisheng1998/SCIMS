import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LabSelectionField = (props) => {
	const [labs, setLabs] = useState([])

	useEffect(() => {
		const fetchLabs = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}

			try {
				const { data } = await axios.get('/api/auth/labs', config)
				setLabs(data.labs)
			} catch (error) {
				setLabs([])
			}
		}

		fetchLabs()
	}, [])

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
				{labs.map((lab) => {
					return (
						<option key={lab._id} value={lab.labName} className='text-gray-700'>
							{lab.labName}
						</option>
					)
				})}
			</select>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value ? (
					'The registration request will be sent to the lab owner.'
				) : (
					<span className='text-green-600'>
						The owner of this lab will receive your registration request after
						your email verified.
					</span>
				)}
			</p>
		</div>
	)
}

export default LabSelectionField
