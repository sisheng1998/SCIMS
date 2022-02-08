import React, { useState } from 'react'
import { XIcon, CheckIcon } from '@heroicons/react/outline'
import ViewPasswordToggle from '../others/ViewPasswordToggle'

const StrongPasswordField = (props) => {
	const [state, setState] = useState({
		passwordLength: false,
		containUppercase: false,
		containLowercase: false,
		containNumber: false,
		containSymbol: false,
	})

	const requirements = {
		passwordLength: '8 characters',
		containUppercase: '1 uppercase letter',
		containLowercase: '1 lowercase letter',
		containNumber: '1 number',
		containSymbol: '1 symbol',
	}

	const inputHandler = (e) => {
		let value = e.target.value

		let uppercase = value.match(/[A-Z]/)
		let lowercase = value.match(/[a-z]/)
		let number = value.match(/\d+/g)
		let symbol = new RegExp(/[^A-Z a-z 0-9]/)

		setState({
			passwordLength: value.length > 7 ? true : false,
			containUppercase: uppercase != null ? true : false,
			containLowercase: lowercase != null ? true : false,
			containNumber: number != null ? true : false,
			containSymbol: symbol.test(value) ? true : false,
		})

		props.setPassword(value)
	}

	return (
		<div className='relative mb-6'>
			<input
				className='w-full pr-10'
				type='password'
				id='password'
				placeholder='Enter a new password'
				autoComplete='off'
				required
				value={props.password}
				onChange={inputHandler}
			/>
			<ViewPasswordToggle fieldId='password' />

			<div className='mt-3 flex flex-wrap text-sm'>
				<p className='w-full text-gray-500'>Must contain at least:</p>
				{Object.entries(requirements).map(([key, value]) => {
					return (
						<div
							key={key}
							className={`mt-1 flex w-1/2 items-center sm:w-full ${
								state[key] ? 'text-green-600' : 'text-gray-400'
							}`}
						>
							{state[key] ? (
								<CheckIcon className='mr-1 h-4 w-4' />
							) : (
								<XIcon className='mr-1 h-4 w-4' />
							)}
							<p className='font-semibold'>{value}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default StrongPasswordField
