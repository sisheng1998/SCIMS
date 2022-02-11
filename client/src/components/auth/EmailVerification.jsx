import React, { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const EmailVerification = () => {
	const params = useParams()

	useEffect(() => {
		const verifyEmail = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}

			try {
				await axios.get(
					`/api/auth/verify-email/${params.emailVerificationToken}`,
					config
				)

				console.log('Success!')
			} catch (error) {
				console.log(error)
			}
		}

		verifyEmail()
	}, [params])

	return <div>Account activated</div>
}

export default EmailVerification
