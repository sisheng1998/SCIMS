import React, { useEffect, useState } from 'react'
import { XIcon, CheckIcon } from '@heroicons/react/outline'
import ViewPasswordToggle from '../utils/ViewPasswordToggle'

const StrongPasswordField = (props) => {
  const [state, setState] = useState({
    passwordLength: false,
    containUppercase: false,
    containLowercase: false,
    containNumber: false,
    containSymbol: false,
  })
  const [strongPassword, setStrongPassword] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(false)

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

  useEffect(() => {
    setStrongPassword(Object.values(state).every(Boolean))
  }, [state])

  useEffect(() => {
    const match = props.password === confirmPassword
    setPasswordMatch(match)

    props.setValidated(match && strongPassword)
  }, [props, confirmPassword, strongPassword])

  return (
    <>
      <label
        htmlFor={props.new ? 'newPassword' : 'password'}
        className='required-input-label'
      >
        {props.new ? 'New Password' : 'Password'}
      </label>
      <div className='relative mb-6'>
        <input
          className={`peer w-full pr-10 ${
            !props.password
              ? ''
              : strongPassword
              ? 'input-valid'
              : 'input-invalid'
          }`}
          type='password'
          id={props.new ? 'newPassword' : 'password'}
          placeholder='Enter a new password'
          required
          value={props.password}
          onChange={inputHandler}
        />
        <ViewPasswordToggle fieldId={props.new ? 'newPassword' : 'password'} />

        <p className='mt-2 text-xs text-gray-400'>
          {!props.password ? (
            <span>
              Strong password is required. (Min. 8 characters with at least 1
              uppercase, 1 lowercase, 1 number, and 1 symbol)
            </span>
          ) : strongPassword ? (
            <span className='text-green-600'>Your password is strong!</span>
          ) : (
            <span className='text-red-600'>
              Please enter a strong password.
            </span>
          )}
        </p>

        <div className='mt-3 hidden flex-wrap text-sm peer-focus:flex'>
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

      <label htmlFor='confirmPassword' className='required-input-label'>
        {props.new ? 'Confirm New Password' : 'Confirm Password'}
      </label>
      <div className='relative mb-6'>
        <input
          className={`w-full pr-10 ${
            !confirmPassword
              ? ''
              : passwordMatch
              ? 'input-valid'
              : 'input-invalid'
          }`}
          type='password'
          id='confirmPassword'
          placeholder='Re-enter the new password'
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <ViewPasswordToggle fieldId='confirmPassword' />

        <p className='mt-2 text-xs text-gray-400'>
          {!confirmPassword ? (
            'Both password must be matched.'
          ) : passwordMatch ? (
            <span className='text-green-600'>Passwords matched!</span>
          ) : (
            <span className='text-red-600'>Passwords does not match.</span>
          )}
        </p>
      </div>
    </>
  )
}

export default StrongPasswordField
