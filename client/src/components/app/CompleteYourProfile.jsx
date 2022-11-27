import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useLogout from '../../hooks/useLogout'
import {
  LogoutIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/outline'
import useAuth from '../../hooks/useAuth'
import NameField from '../validations/NameField'
import LabSelectionField from '../validations/LabSelectionField'
import MatricNoField from '../validations/MatricNoField'
import AltEmailField from '../validations/AltEmailField'
import ImageDropZone from './components/ImageDropZone'
import RenderImage from './components/RenderImage'
import SampleImages from './components/SampleImages'

const CompleteYourProfile = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const logout = useLogout()

  const showLabSelection = auth.roles.length === 0

  const [image, setImage] = useState('')
  const [matricNo, setMatricNo] = useState('')
  const [name, setName] = useState('')
  const [altEmail, setAltEmail] = useState('')
  const [labId, setLabId] = useState('')

  const [matricNoValidated, setMatricNoValidated] = useState(false)
  const [nameValidated, setNameValidated] = useState(false)
  const [labValidated, setLabValidated] = useState(false)
  const [altEmailValidated, setAltEmailValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)

  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const completeProfileHandler = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const profileData = {
      matricNo,
      name,
      altEmail,
    }

    if (showLabSelection) {
      profileData.labId = labId
    }

    const formData = new FormData()
    formData.append('profileInfo', JSON.stringify(profileData))
    formData.append('avatar', image)

    try {
      await axiosPrivate.post('/api/private/profile/complete-profile', formData)
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage(
          'An account with this matric number or staff number already exists.'
        )
      } else if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }
  }

  useEffect(() => {
    setErrorMessage('')
  }, [name, labId, matricNo, altEmail, image])

  useEffect(() => {
    if (showLabSelection) {
      setAllowed(
        nameValidated &&
          labValidated &&
          matricNoValidated &&
          altEmailValidated &&
          image
      )
    } else {
      setAllowed(
        nameValidated && matricNoValidated && altEmailValidated && image
      )
    }
  }, [
    nameValidated,
    labValidated,
    matricNoValidated,
    altEmailValidated,
    image,
    showLabSelection,
  ])

  return (
    <>
      {!success && <h1 className='my-6 text-center'>Complete Your Profile</h1>}

      {success ? (
        <div className='auth-card mt-8 text-center'>
          <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
          <h2 className='mt-6 mb-2 text-green-600'>Profile Completed!</h2>
          <p>Your profile have been completed.</p>

          <p className='mt-6'>
            You will be able to interact with the system after your request is
            approved.
          </p>

          <button
            className='mt-6 w-32'
            type='submit'
            onClick={() => window.location.reload(false)}
          >
            Okay
          </button>
        </div>
      ) : (
        <div className='auth-card'>
          <form
            onSubmit={completeProfileHandler}
            spellCheck='false'
            autoComplete='off'
          >
            {showLabSelection && (
              <>
                <label htmlFor='labSelection' className='required-input-label'>
                  Lab
                </label>
                <LabSelectionField
                  value={labId}
                  setValue={setLabId}
                  validated={labValidated}
                  setValidated={setLabValidated}
                />
              </>
            )}

            <div className='flex items-baseline justify-between'>
              <label htmlFor='profilePic' className='required-input-label'>
                Profile Picture
              </label>
              {!image && <SampleImages />}
            </div>

            {!image ? (
              <>
                <ImageDropZone
                  setImage={setImage}
                  setErrorMessage={setErrorMessage}
                />
                <p className='mt-2 text-xs text-gray-400'>
                  Only JPG, JPEG, and PNG are supported. Max file size: 5 MB.
                </p>
              </>
            ) : (
              <RenderImage image={image} setImage={setImage} />
            )}

            <label htmlFor='matricNo' className='required-input-label mt-6'>
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

            <AltEmailField
              value={altEmail}
              setValue={setAltEmail}
              validated={altEmailValidated}
              setValidated={setAltEmailValidated}
              showValidated={true}
            />

            <button className='mt-3 w-full' type='submit' disabled={!allowed}>
              Submit
            </button>

            {errorMessage && (
              <p className='mt-6 flex items-center text-sm font-medium text-red-600'>
                <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      )}

      <p className='mt-6 text-center'>
        <span
          onClick={logout}
          className='inline-flex cursor-pointer items-center font-semibold text-indigo-600 transition hover:text-indigo-700'
        >
          <LogoutIcon className='mr-1 h-5 w-5' />
          Logout
        </span>
      </p>
    </>
  )
}

export default CompleteYourProfile
