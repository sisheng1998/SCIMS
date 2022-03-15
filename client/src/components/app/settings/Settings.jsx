import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import Title from '../components/Title'
import ImageDropZone from '../../others/ImageDropZone'
import RenderImage from '../../others/RenderImage'

const Settings = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	const [image, setImage] = useState('')

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

				{!image ? (
					<ImageDropZone setImage={setImage} />
				) : (
					<RenderImage image={image} setImage={setImage} />
				)}

				<p
					className={`mt-2 text-xs ${
						!image ? 'text-gray-400' : 'text-green-600'
					}`}
				>
					{!image
						? 'Only JPG, JPEG, and PNG are supported. Max file size: 5 MB.'
						: 'Looks good!'}
				</p>
			</div>
		</>
	)
}

export default Settings
