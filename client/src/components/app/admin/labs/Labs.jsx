import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../others/LoadingScreen'
import Title from '../../components/Title'
import LabsTable from './LabsTable'

const Labs = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()
	const [labsData, setLabsData] = useState('')
	const [users, setUsers] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) {
			setRefresh(false)
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getLabs = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/admin/labs', {
					signal: controller.signal,
				})
				if (isMounted) {
					const processedData = data.labs.map((lab, index) => ({
						...lab,
						index: index,
						ownerName: lab.labOwner.name,
						ownerEmail: lab.labOwner.email,
					}))
					setLabsData(processedData)
					setUsers(data.users)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getLabs()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, refresh])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title
				title='All Labs'
				hasButton={true}
				hasRefreshButton={true}
				buttonText='Add Lab'
				buttonAction={() => console.log('hello')}
				setRefresh={setRefresh}
			/>
			<LabsTable data={labsData} setEditLabSuccess={setRefresh} users={users} />
		</>
	)
}

export default Labs
