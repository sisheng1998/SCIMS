import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthProvider'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Dashboard = () => {
	const { setAuth } = useContext(AuthContext)
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

	const [error, setError] = useState('')
	const [privateData, setPrivateData] = useState('')

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		const fetchPrivateData = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/private', {
					signal: controller.signal,
				})
				isMounted && setPrivateData(data.data)
				setError('')
			} catch (error) {
				navigate('/login')
			}
		}

		fetchPrivateData()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, navigate])

	const logout = async () => {
		try {
			await axios.put('/api/auth/logout')
			setAuth({})
			navigate('/login')
		} catch (error) {
			setError('Unable to logout.')
		}
	}

	return error ? (
		<div>
			<div>{error}</div>
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
