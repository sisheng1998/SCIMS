import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthProvider'

const Dashboard = () => {
	const { auth, setAuth } = useContext(AuthContext)
	console.log(auth)
	const navigate = useNavigate()

	const [error, setError] = useState('')
	const [privateData, setPrivateData] = useState('')

	useEffect(() => {
		const fetchPrivateData = async () => {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.accessToken}`,
				},
			}

			try {
				const { data } = await axios.get('/api/private', config)
				setPrivateData(data.data)
			} catch (error) {
				setError('You are not authorized, please login.')
			}
		}

		fetchPrivateData()
	}, [auth, navigate])

	const logout = async () => {
		try {
			await axios.put('/api/auth/logout')
			setAuth({})
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
			<button onClick={logout}>Logout</button>
		</div>
	) : (
		<>
			<div>{privateData}</div>
			<button onClick={logout}>Logout</button>
		</>
	)
}

export default Dashboard
