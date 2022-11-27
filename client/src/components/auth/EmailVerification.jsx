import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { XIcon, CheckIcon } from '@heroicons/react/outline'

const EmailVerification = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [success, setSuccess] = useState('')
  const [profileCompleted, setProfileCompleted] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      try {
        const { data } = await axios.put(
          `/api/auth/verify-email/${params.emailVerificationToken}`,
          config
        )

        setProfileCompleted(data.isProfileNotCompleted ? false : true)
        setSuccess(true)
      } catch (error) {
        setSuccess(false)
      }
    }

    verifyEmail()
  }, [params])

  return (
    <>
      <div
        className={`auth-card mt-8 text-center ${
          success === '' ? 'hidden' : ''
        }`}
      >
        {success ? (
          <>
            <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
            <h2 className='mt-6 mb-2 text-green-600'>Email Verified!</h2>
            <p>Your email has been verified.</p>

            {!profileCompleted && (
              <p className='mt-6'>Kindly login to complete your profile.</p>
            )}

            <button
              className='mt-6 w-32'
              type='submit'
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
            <h2 className='mt-6 mb-2 text-red-600'>Invalid Link!</h2>
            <p>The verification link provided is invalid or expired.</p>
            <p className='mt-6'>
              Kindly check your registered email for the valid link or login to
              your account and request a new link.
            </p>
          </>
        )}
      </div>

      <p className='mt-6'>
        Return to <Link to='/login'>Login</Link>
      </p>
    </>
  )
}

export default EmailVerification
