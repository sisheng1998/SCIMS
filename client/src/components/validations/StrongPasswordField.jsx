import React, { Component } from 'react'
import { XIcon, CheckIcon } from '@heroicons/react/outline'
import ViewPasswordToggle from '../others/ViewPasswordToggle'

class StrongPasswordField extends Component {
	state = {
		password: '',
		passwordLength: false,
		containUppercase: false,
		containLowercase: false,
		containNumber: false,
		containSymbol: false,
	}

	checkForUppercase = (string) => {
		let matches = string.match(/[A-Z]/)
		this.setState({
			containUppercase: matches != null ? true : false,
		})
	}

	checkForLowercase = (string) => {
		let matches = string.match(/[a-z]/)
		this.setState({
			containLowercase: matches != null ? true : false,
		})
	}

	checkForNumber = (string) => {
		let matches = string.match(/\d+/g)
		this.setState({
			containNumber: matches != null ? true : false,
		})
	}

	checkForSymbol = (string) => {
		let symbol = new RegExp(/[^A-Z a-z 0-9]/)
		this.setState({
			containSymbol: symbol.test(string) ? true : false,
		})
	}

	onChangeHandler = () => (e) => {
		let targetValue = e.target.value

		this.checkForUppercase(targetValue)
		this.checkForLowercase(targetValue)
		this.checkForNumber(targetValue)
		this.checkForSymbol(targetValue)

		this.setState({
			passwordLength: targetValue.length > 7 ? true : false,
		})
	}

	render() {
		const requirements = {
			passwordLength: ['Minimum', '8 characters'],
			containUppercase: ['At least', '1 uppercase letter'],
			containLowercase: ['At least', '1 lowercase letter'],
			containNumber: ['At least', '1 number'],
			containSymbol: ['At least', '1 symbol'],
		}

		return (
			<div className='relative mb-6'>
				<input
					className='peer w-full pr-10'
					type='password'
					id='password'
					placeholder='Enter a new password'
					autoComplete='off'
					required
					onChange={this.onChangeHandler('password')}
				/>
				<ViewPasswordToggle fieldId='password' />

				<div className='mt-2 hidden text-sm text-gray-400 peer-focus:block'>
					{Object.entries(requirements).map(([key, value]) => {
						return (
							<div
								key={key}
								className={`mt-1 flex items-center ${
									this.state[key] ? 'text-green-600' : null
								}`}
							>
								{this.state[key] ? (
									<CheckIcon className='mr-1 h-5 w-5' />
								) : (
									<XIcon className='mr-1 h-5 w-5' />
								)}
								<p>
									{value[0] + ' '}
									<span className='font-semibold'>{value[1]}</span>
								</p>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

export default StrongPasswordField
