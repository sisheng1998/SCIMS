import React from 'react'
import useAuth from '../../../hooks/useAuth'
import GetLetterPicture from '../../utils/GetLetterPicture'
import GetRoleName from '../../utils/GetRoleName'

const UserInfoCard = () => {
	const { auth } = useAuth()
	const imageSrc = auth.avatar
		? auth.avatarPath + auth.avatar
		: GetLetterPicture(auth.name)

	return (
		<div>
			<p className='mb-2 text-lg font-medium text-gray-500'>Welcome!</p>
			<div className='mb-6 flex max-w-max items-center space-x-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow'>
				<img
					src={imageSrc}
					alt='Avatar'
					className='h-16 w-16 rounded-full object-cover'
					height='200'
					width='200'
					draggable={false}
				/>

				<div>
					<h4 className='text-gray-700'>{auth.name}</h4>
					<p className='text-sm text-gray-500'>{auth.email}</p>
				</div>

				<p className='self-start rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold capitalize text-indigo-600'>
					{GetRoleName(auth.currentRole)}
				</p>
			</div>
		</div>
	)
}

export default UserInfoCard
