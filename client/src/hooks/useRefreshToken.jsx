import axios from 'axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
	const { setAuth } = useAuth()

	const config = {
		withCredentials: true,
	}

	const refresh = async () => {
		const { data } = await axios.get('/api/auth/refresh-token', config)

		const accessToken = data.accessToken
		const roles = data.roles

		setAuth((prev) => {
			return { ...prev, accessToken: accessToken, roles: roles }
		})

		return accessToken
	}

	return refresh
}

export default useRefreshToken
