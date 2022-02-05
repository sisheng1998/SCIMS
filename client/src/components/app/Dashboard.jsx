import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
	const navigate = useNavigate()
	const [error, setError] = useState('')
	const [privateData, setPrivateData] = useState('')

	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			navigate('/login')
		}

		const fetchPrivateData = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			}

			try {
				const { data } = await axios.get('/api/private', config)
				setPrivateData(data.data)
			} catch (error) {
				localStorage.removeItem('accessToken')
				setError('You are not authorized, please login.')
			}
		}

		fetchPrivateData()
	}, [navigate])

	const logoutHandler = async () => {
		try {
			await axios.put('/api/auth/logout')
			localStorage.removeItem('accessToken')
			navigate('/login')
		} catch (error) {
			setError('Unable to logout.')
		}
	}

	const refreshHandler = async () => {
		try {
			const { data } = await axios.get('/api/auth/refresh-token')
			localStorage.setItem('accessToken', data.accessToken)
		} catch (error) {
			setError('Unable to get new access token.')
		}
	}

	return error ? (
		<div>
			<div>{error}</div>
			<button onClick={refreshHandler}>Refresh</button>
			<button onClick={logoutHandler}>Logout</button>
		</div>
	) : (
		<>
			<div>{privateData}</div>
			<button onClick={logoutHandler}>Logout</button>
		</>
	)
}

export default Dashboard
