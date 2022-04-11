import axios from 'axios'
import useAuth from './useAuth'

const getCookieValue = (name) =>
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''

const useRefreshToken = () => {
	const { setAuth } = useAuth()

	const config = {
		withCredentials: true,
	}

	const refresh = async () => {
		const { data } = await axios.put(
			'/api/auth/refresh-token',
			{ refreshToken: getCookieValue('refreshToken') },
			config
		)

		const email = data.email
		const accessToken = data.accessToken
		const roles = data.roles
		const id = data.id
		const name = data.name
		const avatar = data.avatar
		const avatarPath = data.avatarPath
		const SDSPath = data.SDSPath

		setAuth((prev) => {
			return {
				...prev,
				email,
				accessToken,
				roles,
				id,
				name,
				avatar,
				avatarPath,
				SDSPath,
			}
		})

		return accessToken
	}

	return refresh
}

export default useRefreshToken
