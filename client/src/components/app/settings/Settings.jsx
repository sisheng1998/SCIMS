import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import Title from '../components/Title'
import ImageDropZone from '../components/ImageDropZone'
import RenderImage from '../components/RenderImage'
import SampleImages from '../components/SampleImages'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const Settings = () => {
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const { auth } = useAuth()

	const [image, setImage] = useState('')

	useEffect(() => {
		auth.currentLabId === ROLES_LIST.admin.toString() &&
			navigate('/admin/settings')
	}, [auth.currentLabId, navigate])

	const submitHandler = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('avatar', image)

		try {
			await axiosPrivate.post('/api/private/avatar', formData)
			setImage('')
		} catch (error) {
			if (error.response?.status === 500) {
				console.log('Server not responding. Please try again later.')
			} else {
				console.log('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	return (
		<>
			<Title title='Settings' hasButton={false} hasRefreshButton={false} />

			<div className='auth-card mx-auto'>
				<form onSubmit={submitHandler} spellCheck='false' autoComplete='off'>
					<div className='flex items-end justify-between'>
						<label htmlFor='profilePic' className='required-input-label'>
							Profile Picture
						</label>
						{!image && <SampleImages />}
					</div>

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

					<button className='mt-3 w-full' type='submit' disabled={!image}>
						Send
					</button>
				</form>
			</div>
		</>
	)
}

export default Settings
