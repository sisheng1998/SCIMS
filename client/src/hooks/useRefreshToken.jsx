import axios from 'axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
	const { setAuth } = useAuth()

	const config = {
		withCredentials: true,
	}

	const refresh = async () => {
		const { data } = await axios.get('/api/auth/refresh-token', config)

		const email = data.email
		const accessToken = data.accessToken
		const roles = data.roles
		const id = data.id

		setAuth((prev) => {
			return { ...prev, email, accessToken, roles, id }
		})

		return accessToken
	}

	return refresh
}

export default useRefreshToken
