import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useLogout from '../../hooks/useLogout'

const Dashboard = () => {
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const logout = useLogout()

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
