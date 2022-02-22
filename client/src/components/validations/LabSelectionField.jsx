import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LabSelectionField = (props) => {
	const [labs, setLabs] = useState([])

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		const fetchLabs = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
				signal: controller.signal,
			}

			try {
				const { data } = await axios.get('/api/auth/labs', config)
				isMounted && setLabs(data.labs)
			} catch (error) {
				setLabs([])
			}
		}

		fetchLabs()

		return () => {
			isMounted = false
			controller.abort()
		}
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
				{labs
					.sort((a, b) => (a['labName'] > b['labName'] ? 1 : -1))
					.map((lab) => {
						const existed =
							props.checkExist &&
							props.userRoles.some((role) => role.lab._id === lab._id)

						return (
							<option
								key={lab._id}
								disabled={existed}
								value={lab._id}
								className='text-gray-700 disabled:text-gray-400'
							>
								{lab.labName}
							</option>
						)
					})}
			</select>

			<p className='mt-2 text-xs text-gray-400'>
				{!props.value ? (
					`The ${
						props.checkExist ? '' : 'registration '
					}request will be sent to the lab owner.`
				) : (
					<span className='text-green-600'>
						The owner of this lab will receive your{' '}
						{props.checkExist ? '' : 'registration '}request
						{props.checkExist ? '' : ' after your email verified'}.
					</span>
				)}
			</p>
		</div>
	)
}

export default LabSelectionField
