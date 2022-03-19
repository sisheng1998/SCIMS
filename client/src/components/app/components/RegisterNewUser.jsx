import React from 'react'
import USMEmailField from '../../validations/USMEmailField'
import PasswordGenerator from '../../utils/PasswordGenerator'
import LoginPasswordField from '../../validations/LoginPasswordField'
import NameField from '../../validations/NameField'
import MatricNoField from '../../validations/MatricNoField'

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
	matricNo,
	setMatricNo,
	matricNoValidated,
	setMatricNoValidated,
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
					/>
				</div>

				<div className='flex-1'>
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

			<div className='flex space-x-6'>
				<div className='flex-1'>
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
				</div>

				<div className='flex-1'>
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
						showValidated={true}
					/>
				</div>
			</div>
		</>
	)
}

export default RegisterNewUser
