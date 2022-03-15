import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import Title from '../components/Title'
import ImageDropZone from '../../validations/ImageDropZone'

const Settings = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId === ROLES_LIST.admin.toString() &&
			navigate('/admin/settings')
	}, [auth.currentLabId, navigate])

	return (
		<>
			<Title title='Settings' hasButton={false} hasRefreshButton={false} />
			<hr className='mb-6 border-gray-200' />

			<div className='auth-card mx-auto'>
				<label htmlFor='profilePic' className='required-input-label'>
					Profile Picture
				</label>
				<ImageDropZone />
			</div>
		</>
	)
}

export default Settings
