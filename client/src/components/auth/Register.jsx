import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import USMEmailField from '../validations/USMEmailField'
import StrongPasswordField from '../validations/StrongPasswordField'
import NameField from '../validations/NameField'
import LabSelectionField from '../validations/LabSelectionField'
import MatricNoField from '../validations/MatricNoField'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/outline'

const Register = () => {
  const [emails, setEmails] = useState([])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchEmails = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }

      try {
        const { data } = await axios.get('/api/auth/emails', config)
        isMounted && setEmails(data.emails)
      } catch (error) {
        setEmails([])
        if (error.response?.status === 500) {
          setErrorMessage('Server not responding. Please try again later.')
        }
      }
    }

    fetchEmails()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [labId, setLabId] = useState('')
  const [matricNo, setMatricNo] = useState('')

  const [USMEmailValidated, setUSMEmailValidated] = useState(false)
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [nameValidated, setNameValidated] = useState(false)
  const [labValidated, setLabValidated] = useState(false)
  const [matricNoValidated, setMatricNoValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [nextStep, setNextStep] = useState(false)
  const [allowNextStep, setAllowNextStep] = useState(false)

  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const registerHandler = async (e) => {
    e.preventDefault()

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      await axios.post(
        '/api/auth/register',
        { name, email, password, labId, matricNo },
        config
      )
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        if (error.response.data.error === 'Matric number existed.') {
          setErrorMessage(
            'An account with this matric number or staff number already exists.'
          )
        } else {
          setErrorMessage('An account with this email already exists.')
        }
      } else if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }
  }

  useEffect(() => {
    setErrorMessage('')
  }, [email, password, name, labId, matricNo])

  useEffect(() => {
    setAllowNextStep(USMEmailValidated && passwordValidated)

    setAllowed(
      USMEmailValidated &&
        passwordValidated &&
        nameValidated &&
        labValidated &&
        matricNoValidated
    )
  }, [
    USMEmailValidated,
    passwordValidated,
    nameValidated,
    labValidated,
    matricNoValidated,
  ])

  return (
    <>
      {success ? null : (
        <h1 className='my-6 text-center'>Create New Account</h1>
      )}

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
            <div className={!nextStep ? 'block' : 'hidden'}>
              <label htmlFor='email' className='required-input-label'>
                Email Address
              </label>
              <USMEmailField
                message='Only *@usm.my or *.usm.my are allowed. (Used for login)'
                successMessage='This email will be used for login.'
                checkExist={true}
                existingEmails={emails}
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

              <div className='mt-6 text-right'>
                <p
                  onClick={() => setNextStep(true)}
                  className={`inline-flex items-center font-medium text-indigo-600 transition hover:text-indigo-700 ${
                    allowNextStep
                      ? 'cursor-pointer'
                      : 'pointer-events-none opacity-50'
                  }`}
                >
                  Next
                  <ArrowRightIcon className='ml-1 h-4 w-4' />
                </p>
              </div>
            </div>

            <div className={nextStep ? 'block' : 'hidden'}>
              <div className='mb-6'>
                <p
                  onClick={() => setNextStep(false)}
                  className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
                >
                  <ArrowLeftIcon className='mr-1 h-4 w-4' />
                  Previous
                </p>
              </div>

              <label htmlFor='matricNo' className='required-input-label'>
                Matric/Staff Number
              </label>
              <MatricNoField
                placeholder='Enter your matric/staff number'
                value={matricNo}
                setValue={setMatricNo}
                validated={matricNoValidated}
                setValidated={setMatricNoValidated}
                showValidated={true}
              />

              <label htmlFor='name' className='required-input-label'>
                Full Name <span className='text-xs'>(as per IC/Passport)</span>
              </label>
              <NameField
                id='name'
                placeholder='Enter your full name'
                required={true}
                value={name}
                setValue={setName}
                validated={nameValidated}
                setValidated={setNameValidated}
                showValidated={true}
              />

              <label htmlFor='labSelection' className='required-input-label'>
                Lab
              </label>
              <LabSelectionField
                value={labId}
                setValue={setLabId}
                validated={labValidated}
                setValidated={setLabValidated}
              />

              <button className='mt-3 w-full' type='submit' disabled={!allowed}>
                Register
              </button>
              <p className='mt-4 text-center text-sm'>
                Click 'Register' to proceed and verify your email.
              </p>
            </div>
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
