import React from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const SendEmailVerification = () => {
	const { state } = useLocation()
	const { email } = state

	const sendEmailHandler = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			await axios.put('/api/auth/verify-email', { email }, config)
		} catch (error) {
			console.log(error)
		}
	}

	return <div>{email}</div>
}

export default SendEmailVerification
