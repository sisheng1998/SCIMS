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
					className='absolute top-2 right-2 h-7 w-7 cursor-pointer rounded-full p-1 text-gray-500 transition hover:bg-indigo-100 hover:text-indigo-600'
					onClick={hidePassword}
				/>
			) : (
				<EyeOffIcon
					className='absolute top-2 right-2 h-7 w-7 cursor-pointer rounded-full p-1 text-gray-500 transition hover:bg-indigo-100 hover:text-indigo-600'
					onClick={viewPassword}
				/>
			)}
		</>
	)
}

export default ViewPasswordToggle
