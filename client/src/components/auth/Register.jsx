import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import USMEmailField from '../validations/USMEmailField'
import StrongPasswordField from '../validations/StrongPasswordField'
import { ExclamationCircleIcon, CheckIcon } from '@heroicons/react/outline'
import LoadingButtonText from '../app/components/LoadingButtonText'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [USMEmailValidated, setUSMEmailValidated] = useState(false)
  const [passwordValidated, setPasswordValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const registerHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      await axios.post('/api/auth/register', { email, password }, config)
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage('An account with this email already exists.')
      } else if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setErrorMessage('')
  }, [email, password])

  useEffect(() => {
    setAllowed(USMEmailValidated && passwordValidated)
  }, [USMEmailValidated, passwordValidated])

  return (
    <>
      {!success && <h1 className='my-6 text-center'>Create New Account</h1>}

      {success ? (
        <div className='auth-card mt-8 text-center'>
          <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
          <h2 className='mt-6 mb-2 text-green-600'>Registration Success!</h2>
          <p>Your account has been created.</p>
          <p className='mt-6'>An email has been sent to:</p>
          <p className='text-lg font-semibold'>
            {email ? email : 'Your Registered Email Address'}
          </p>
          <p className='mt-6'>
            Kindly check your email and click on the verification link provided
            to verify your email.
          </p>
        </div>
      ) : (
        <div className='auth-card'>
          {errorMessage && (
            <p className='mb-6 flex items-center text-sm font-medium text-red-600'>
              <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
              {errorMessage}
            </p>
          )}

          <form
            onSubmit={registerHandler}
            spellCheck='false'
            autoComplete='off'
          >
            <label htmlFor='email' className='required-input-label'>
              Email Address
            </label>
            <USMEmailField
              message='Only *@usm.my or *.usm.my are allowed.'
              successMessage='Looks good!'
              checkExist={false}
              value={email}
              setValue={setEmail}
              validated={USMEmailValidated}
              setValidated={setUSMEmailValidated}
              showValidated={true}
            />

            <StrongPasswordField
              new={false}
              password={password}
              setPassword={setPassword}
              setValidated={setPasswordValidated}
            />

            <button
              className='mt-9 flex w-full items-center justify-center'
              type='submit'
              disabled={!allowed || isLoading}
            >
              {isLoading ? <LoadingButtonText /> : 'Register'}
            </button>
            <p className='mt-4 text-center text-sm'>
              Click 'Register' to proceed and verify your email.
            </p>
          </form>
        </div>
      )}

      <p className='mt-6'>
        {success ? 'Return to ' : 'Already have an account? '}
        <Link to='/login'>Login</Link>
      </p>
    </>
  )
}

export default Register
