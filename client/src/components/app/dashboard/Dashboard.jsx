import React from 'react'
//import { useState, useEffect } from 'react'
//import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Dashboard = () => {
	//const axiosPrivate = useAxiosPrivate()

	//const [active, setActive] = useState('')
	//const [error, setError] = useState('')
	//const [privateData, setPrivateData] = useState('')

	/*useEffect(() => {
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
	}, [axiosPrivate, navigate])*/

	return (
		<h2 className='mt-6 text-center'>You have the access to the system.</h2>
	)
}

export default Dashboard
