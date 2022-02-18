import React from 'react'

const arrayFromLowToHigh = (low, high) => {
	const array = []

	for (let i = low; i <= high; i++) {
		array.push(i)
	}

	return array
}

const PasswordGenerator = () => {
	const NUMBER_OF_CHARACTER = 8
	const LOWERCASE_CHAR_CODES = arrayFromLowToHigh(97, 122)
	const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90)
	const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57)
	const SYMBOL_CHAR_CODES = arrayFromLowToHigh(33, 47)
		.concat(arrayFromLowToHigh(58, 64))
		.concat(arrayFromLowToHigh(91, 96))
		.concat(arrayFromLowToHigh(123, 126))

	const generatePassword = () => {
		const charCodes = LOWERCASE_CHAR_CODES.concat(UPPERCASE_CHAR_CODES)
			.concat(NUMBER_CHAR_CODES)
			.concat(SYMBOL_CHAR_CODES)

		const passwordCharacters = []

		// for (let i = 0; i < charCodes.length; i++) {
		// 	passwordCharacters.push(String.fromCharCode(charCodes[i]))
		// }

		const password = document.getElementById('password')

		Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		).set.call(password, 'Sheng980721!')

		password.dispatchEvent(new Event('change', { bubbles: true }))
	}

	return (
		<span
			onClick={generatePassword}
			className='mb-2 cursor-pointer text-xs font-medium text-indigo-600 transition hover:text-indigo-700'
		>
			Generate Password
		</span>
	)
}

export default PasswordGenerator
