import React from 'react'
import USMEmailField from '../../validations/USMEmailField'
import PasswordGenerator from '../../utils/PasswordGenerator'
import LoginPasswordField from '../../validations/LoginPasswordField'

const RegisterNewUser = ({
  email,
  setEmail,
  USMEmailValidated,
  setUSMEmailValidated,
  excludeStudent,
  password,
  setPassword,
  passwordValidated,
  setPasswordValidated,
}) => {
  return (
    <>
      <div className='flex space-x-6'>
        <div className='flex-1'>
          <label htmlFor='email' className='required-input-label'>
            Email Address
          </label>
          <USMEmailField
            placeholder='Enter USM email'
            message={
              excludeStudent
                ? 'Only *@usm.my or *.usm.my (except student email) are allowed.'
                : 'Only *@usm.my or *.usm.my are allowed.'
            }
            successMessage='Looks good!'
            checkExist={false}
            value={email}
            setValue={setEmail}
            validated={USMEmailValidated}
            setValidated={setUSMEmailValidated}
            excludeStudent={excludeStudent}
            showValidated={true}
          />
        </div>

        <div className='flex-1'>
          <div className='flex items-baseline justify-between'>
            <label htmlFor='password' className='required-input-label'>
              Password
            </label>
            <PasswordGenerator />
          </div>
          <LoginPasswordField
            placeholder='Enter strong password'
            password={password}
            setPassword={setPassword}
            validated={passwordValidated}
            setValidated={setPasswordValidated}
          />
        </div>
      </div>
    </>
  )
}

export default RegisterNewUser
