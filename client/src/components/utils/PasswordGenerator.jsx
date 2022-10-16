import React from 'react'

const getRandomLower = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

const getRandomUpper = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

const getRandomNumber = () => {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}

const getRandomSymbol = () => {
  const symbols = '!@#$%^&*(){}[]=<>/,.'
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const randomFunction = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbols: getRandomSymbol,
}

const PasswordGenerator = () => {
  const NUMBER_OF_CHARACTER = 16

  const generatePassword = () => {
    let generatedPassword = ''

    const passwordInput = document.getElementById('password')
    const viewPassword = document.getElementById('viewPassword')

    const typesArr = ['lower', 'upper', 'number', 'symbols']

    for (let i = 0; i < NUMBER_OF_CHARACTER; i += 4) {
      for (let j = 0; j < typesArr.length; j++) {
        generatedPassword += randomFunction[typesArr[j]]()
      }
    }

    Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set.call(passwordInput, generatedPassword)

    passwordInput.dispatchEvent(new Event('change', { bubbles: true }))
    viewPassword &&
      viewPassword.dispatchEvent(new Event('click', { bubbles: true }))
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
