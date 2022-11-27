import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  CheckIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/outline'
import USMEmailField from '../../components/validations/USMEmailField'

const ChangeEmail = () => {
  const navigate = useNavigate()

  const { state } = useLocation()
  const { email } = state || {}

  useEffect(() => {
    if (!state) {
      navigate('/login')
    }
  }, [state, navigate])

  const [newEmail, setNewEmail] = useState(email || '')
  const [USMEmailValidated, setUSMEmailValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setErrorMessage('')
    setAllowed(USMEmailValidated && newEmail !== email)
  }, [email, newEmail, USMEmailValidated])

  const changeEmailHandler = async (e) => {
    e.preventDefault()

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      await axios.put('/api/auth/change-email', { email, newEmail }, config)
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
  }

  return (
    <>
      {success ? (
        <div className='auth-card mt-8 text-center'>
          <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
          <h2 className='mt-6 mb-2 text-green-600'>Email Changed!</h2>
          <p>An email with verification link has been sent.</p>
          <p className='mt-6'>The email has been sent to:</p>
          <p className='text-lg font-semibold'>
            {newEmail ? newEmail : 'Your New Email Address'}
          </p>
          <p className='mt-6'>
            Kindly check your new email and click on the verification link
            provided to verify your new email.
          </p>
        </div>
      ) : (
        <>
          <h1 className='my-6 text-center'>Change Email</h1>
          <div className='auth-card'>
            <div className='mb-6'>
              <p
                onClick={() =>
                  navigate('/verify-email', { state: { email: email } })
                }
                className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
              >
                <ArrowLeftIcon className='mr-1 h-4 w-4' />
                Back
              </p>
            </div>

            {errorMessage && (
              <p className='mb-6 flex items-center text-left text-sm font-medium text-red-600'>
                <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                {errorMessage}
              </p>
            )}

            <form
              onSubmit={changeEmailHandler}
              spellCheck='false'
              autoComplete='off'
            >
              <label htmlFor='email' className='required-input-label'>
                New Email Address
              </label>
              <USMEmailField
                message='Only *@usm.my or *.usm.my are allowed.'
                checkExist={false}
                value={newEmail}
                setValue={setNewEmail}
                validated={USMEmailValidated}
                setValidated={setUSMEmailValidated}
              />

              <button className='mt-3 w-full' type='submit' disabled={!allowed}>
                Change
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

export default ChangeEmail
