import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import ROLES_LIST from '../../../config/roles_list'
import InfoCard from '../components/InfoCard'
import { UsersIcon, CubeIcon } from '@heroicons/react/outline'
import Title from '../components/Title'
import ScanQRCode from '../components/ScanQRCode'
import useMobile from '../../../hooks/useMobile'
import UserInfoCard from '../components/UserInfoCard'
import QuickAccessCard from '../components/QuickAccessCard'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()
	const isMobile = useMobile()

	useEffect(() => {
		!isMobile &&
			auth.currentLabId === ROLES_LIST.admin.toString() &&
			navigate('/admin')
	}, [auth.currentLabId, navigate, isMobile])

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState({})
	const [days, setDays] = useState(30)

	useEffect(() => {
		if (isMobile) {
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.put(
					'/api/private/dashboard',
					{ labId: auth.currentLabId, days },
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
	}, [axiosPrivate, auth.currentLabId, days, isMobile])

	return isMobile ? (
		<>
			<UserInfoCard />
			<QuickAccessCard />
			<ScanQRCode />
		</>
	) : isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Dashboard' hasButton={false} hasRefreshButton={false}>
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
				<p className='mb-2 font-medium text-gray-500'>Overview</p>
				<div className='-mr-6 flex flex-wrap xl:-mr-4'>
					<InfoCard
						info={info.totalUsers}
						icon={
							<UsersIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
						}
						text='Total User'
						increment={info.newUsers === 0 ? false : info.newUsers}
						haveLetterS={true}
					/>

					{info.pendingUsers !== 0 && (
						<InfoCard
							info={info.pendingUsers}
							icon={
								<UsersIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
							}
							text='Pending Approval'
						/>
					)}

					<InfoCard
						info={info.totalChemicals}
						icon={
							<CubeIcon className='h-14 w-14 rounded-full bg-pink-50 p-3 text-pink-500' />
						}
						text='Total Chemical'
						increment={info.newChemicals === 0 ? false : info.newChemicals}
						haveLetterS={true}
					/>

					{info.lowAmountChemicals !== 0 && (
						<InfoCard
							info={info.lowAmountChemicals}
							icon={
								<CubeIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
							}
							text='Low Amount'
						/>
					)}

					{info.expiringChemicals !== 0 && (
						<InfoCard
							info={info.expiringChemicals}
							icon={
								<CubeIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
							}
							text='Expiring Soon'
						/>
					)}

					{info.expiredChemicals !== 0 && (
						<InfoCard
							info={info.expiredChemicals}
							icon={
								<CubeIcon className='h-14 w-14 rounded-full bg-red-50 p-3 text-red-500' />
							}
							text='Expired'
						/>
					)}

					{info.disposedChemicals !== 0 && (
						<InfoCard
							info={info.disposedChemicals}
							icon={
								<CubeIcon className='h-14 w-14 rounded-full bg-red-50 p-3 text-red-500' />
							}
							text='Disposed'
						/>
					)}
				</div>
			</div>
		</>
	)
}

export default Dashboard
