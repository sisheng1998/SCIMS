import React, { useState } from 'react'
import { EyeOffIcon, EyeIcon } from '@heroicons/react/outline'

const ViewPasswordToggle = (props) => {
	const [visible, setVisibility] = useState(false)

	const viewPassword = () => {
		document.getElementById(props.fieldId).type = 'text'
		setVisibility((visibility) => !visibility)
	}

	const hidePassword = () => {
		document.getElementById(props.fieldId).type = 'password'
		setVisibility((visibility) => !visibility)
	}

	return (
		<>
			{visible ? (
				<EyeIcon
					className='absolute top-3 right-3 h-5 w-5 cursor-pointer transition hover:text-indigo-600'
					onClick={hidePassword}
				/>
			) : (
				<EyeOffIcon
					className='absolute top-3 right-3 h-5 w-5 cursor-pointer transition hover:text-indigo-600'
					onClick={viewPassword}
				/>
			)}
		</>
	)
}

export default ViewPasswordToggle
