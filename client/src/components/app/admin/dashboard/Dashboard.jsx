import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import InfoCard from '../../components/InfoCard'
import { UsersIcon, BeakerIcon, CubeIcon } from '@heroicons/react/outline'
import Title from '../../components/Title'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState({})
	const [days, setDays] = useState(30)

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.put(
					'/api/admin/dashboard',
					{
						days,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					setInfo(data.data)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getInfo()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, days])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Admin Dashboard' hasButton={false} hasRefreshButton={false}>
				<div className='flex items-baseline self-end text-sm text-gray-500'>
					<p>Last</p>
					<select
						className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-1.5 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
						name='days'
						id='days'
						value={days}
						onChange={(e) => setDays(e.target.value)}
					>
						<option value='30'>30 Days</option>
						<option value='60'>60 Days</option>
						<option value='90'>90 Days</option>
					</select>
				</div>
			</Title>

			<div className='mb-2'>
				<p className='mb-2 font-medium text-gray-500'>Overview</p>
				<div className='-mr-4 flex flex-wrap'>
					<InfoCard
						info={info.totalLabs}
						icon={
							<BeakerIcon className='h-14 w-14 rounded-full bg-blue-50 p-3 text-blue-500' />
						}
						text='Total Lab'
						increment={info.newLabs === 0 ? false : info.newLabs}
						haveLetterS={true}
					/>

					<InfoCard
						info={info.totalUsers}
						icon={
							<UsersIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
						}
						text='Total User'
						increment={info.newUsers === 0 ? false : info.newUsers}
						haveLetterS={true}
					/>

					<InfoCard
						info={info.totalChemicals}
						icon={
							<CubeIcon className='h-14 w-14 rounded-full bg-pink-50 p-3 text-pink-500' />
						}
						text='Total Chemical'
						increment={info.newChemicals === 0 ? false : info.newChemicals}
						haveLetterS={true}
					/>
				</div>
			</div>
		</>
	)
}

export default Dashboard
