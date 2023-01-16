import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import USMEmailField from '../validations/USMEmailField'
import { ExclamationCircleIcon, CheckIcon } from '@heroicons/react/outline'
import LoadingButtonText from '../app/components/LoadingButtonText'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [emailValidated, setEmailValidated] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const forgotPasswordHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      await axios.post('/api/auth/forgot-password', { email }, config)
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('An account with this email does not exists.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setErrorMessage('')
  }, [email])

  return (
    <>
      {success ? (
        <div className='auth-card mt-8 text-center'>
          <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
          <h2 className='mt-6 mb-2 text-green-600'>Email Sent!</h2>
          <p>An email with reset password link has been sent.</p>
          <p className='mt-6'>The email has been sent to:</p>
          <p className='text-lg font-semibold'>
            {email ? email : 'Your Registered Email Address'}
          </p>
          <p className='my-6'>
            Kindly check your email and click on the link provided to reset your
            password.
          </p>
          <p className='text-sm font-medium'>
            *The link will be valid for 30 minutes only.
          </p>
        </div>
      ) : (
        <>
          <h1 className='my-6 text-center'>Forgot Password?</h1>

          <div className='auth-card'>
            {errorMessage && (
              <p className='mb-6 flex items-center text-sm font-medium text-red-600'>
                <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                {errorMessage}
              </p>
            )}

            <p className='mb-6'>
              Enter your login email address and we will send you a link to
              reset your password.
            </p>

            <form onSubmit={forgotPasswordHandler}>
              <label htmlFor='email' className='required-input-label'>
                Email Address
              </label>
              <USMEmailField
                message='Only *@usm.my or *.usm.my are allowed.'
                successMessage='Looks good!'
                checkExist={false}
                value={email}
                setValue={setEmail}
                validated={emailValidated}
                setValidated={setEmailValidated}
                showValidated={true}
              />

              <button
                className='mt-9 flex w-full items-center justify-center'
                type='submit'
                disabled={!emailValidated || isLoading}
              >
                {isLoading ? <LoadingButtonText /> : 'Send'}
              </button>
            </form>
          </div>
        </>
      )}
      <p className='mt-6'>
        Return to <Link to='/login'>Login</Link>
      </p>
    </>
  )
}

export default ForgotPassword
