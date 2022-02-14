import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { XIcon, CheckIcon } from '@heroicons/react/outline'

const EmailVerification = () => {
	const params = useParams()
	const [success, setSuccess] = useState('')

	useEffect(() => {
		const verifyEmail = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}

			try {
				await axios.put(
					`/api/auth/verify-email/${params.emailVerificationToken}`,
					config
				)

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
						<p className='my-6'>
							Your registration request is sent to the lab owner of your chosen
							lab.
						</p>
						<p>
							You will be able to interact with the system after your request is
							approved.
						</p>
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
