import React, { useEffect, useState } from 'react'
import ViewPasswordToggle from '../utils/ViewPasswordToggle'

const LoginPasswordField = (props) => {
  const [state, setState] = useState({
    passwordLength: false,
    containUppercase: false,
    containLowercase: false,
    containNumber: false,
    containSymbol: false,
  })

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

  useEffect(() => {
    props.setValidated(Object.values(state).every(Boolean))
  }, [props, state])

  return (
    <div className='relative mb-6'>
      <input
        className={`w-full pr-10 ${
          !props.password
            ? ''
            : props.validated
            ? 'input-valid'
            : 'input-invalid'
        }`}
        type='password'
        id='password'
        placeholder={props.placeholder || 'Enter your password'}
        required
        value={props.password}
        onChange={inputHandler}
      />
      <ViewPasswordToggle fieldId='password' />

      <p className='mt-2 text-xs text-gray-400'>
        {!props.password ? (
          <span>
            Strong password is required. (Min. 8 characters with at least 1
            uppercase, 1 lowercase, 1 number, and 1 symbol)
          </span>
        ) : props.validated ? (
          <span className='text-green-600'>Looks good!</span>
        ) : (
          <span className='text-red-600'>
            Please enter a strong password. (Min. 8 characters with at least 1
            uppercase, 1 lowercase, 1 number, and 1 symbol)
          </span>
        )}
      </p>
    </div>
  )
}

export default LoginPasswordField
