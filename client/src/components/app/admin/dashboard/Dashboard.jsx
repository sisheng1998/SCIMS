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

			<div className='mb-6'>
				<p className='mb-2 text-lg font-medium text-gray-500'>Overview</p>
				<div className='-mr-6 flex flex-wrap xl:-mr-4'>
					<InfoCard
						info={info.totalLabs}
						icon={
							<div className='rounded-full bg-blue-50 p-4'>
								<BeakerIcon className='h-8 w-8 text-blue-500' />
							</div>
						}
						text='Total Lab'
						increment={info.newLabs === 0 ? false : info.newLabs}
						haveLetterS={true}
					/>

					<InfoCard
						info={info.totalUsers}
						icon={
							<div className='rounded-full bg-purple-50 p-4'>
								<UsersIcon className='h-8 w-8 text-purple-500' />
							</div>
						}
						text='Total User'
						increment={info.newUsers === 0 ? false : info.newUsers}
						haveLetterS={true}
					/>

					<InfoCard
						info={info.totalChemicals}
						icon={
							<div className='rounded-full bg-pink-50 p-4'>
								<CubeIcon className='h-8 w-8 text-pink-500' />
							</div>
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
