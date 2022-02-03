import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
	const navigate = useNavigate()
	const [error, setError] = useState('')
	const [privateData, setPrivateData] = useState('')

	useEffect(() => {
		if (!localStorage.getItem('authToken')) {
			navigate('/login')
		}

		const fetchPrivateData = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			}

			try {
				const { data } = await axios.get('/api/private', config)
				setPrivateData(data.data)
			} catch (error) {
				localStorage.removeItem('authToken')
				setError('You are not authorized, please login')
			}
		}

		fetchPrivateData()
	}, [navigate])

	const logoutHandler = () => {
		localStorage.removeItem('authToken')
		navigate('/login')
	}

	return error ? (
		<span>{error}</span>
	) : (
		<>
			<div>{privateData}</div>
			<button onClick={logoutHandler}>Logout</button>
		</>
	)
}

export default Dashboard
