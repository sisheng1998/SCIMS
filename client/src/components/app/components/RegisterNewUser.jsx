import React from 'react'
import USMEmailField from '../../validations/USMEmailField'
import PasswordGenerator from '../../others/PasswordGenerator'
import LoginPasswordField from '../../validations/LoginPasswordField'
import NameField from '../../validations/NameField'
import EmailField from '../../validations/EmailField'

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
	name,
	setName,
	nameValidated,
	setNameValidated,
	altEmail,
	setAltEmail,
	emailValidated,
	setEmailValidated,
}) => {
	return (
		<>
			<div className='flex'>
				<div className='mr-3 flex-1'>
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
					/>
				</div>

				<div className='ml-3 flex-1'>
					<div className='flex items-end justify-between'>
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

			<div className='flex'>
				<div className='mr-3 flex-1'>
					<label htmlFor='name' className='required-input-label'>
						Full Name <span className='text-xs'>(as per IC/Passport)</span>
					</label>
					<NameField
						id='name'
						placeholder='Enter full name'
						required={true}
						value={name}
						setValue={setName}
						validated={nameValidated}
						setValidated={setNameValidated}
					/>
				</div>

				<div className='ml-3 flex-1'>
					<label htmlFor='altEmail' className='required-input-label'>
						Alternative Email Address
					</label>
					<EmailField
						id='altEmail'
						placeholder='Enter email'
						message='Personal email is recommended.'
						value={altEmail}
						setValue={setAltEmail}
						validated={emailValidated}
						setValidated={setEmailValidated}
					/>
				</div>
			</div>
		</>
	)
}

export default RegisterNewUser
