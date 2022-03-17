import axios from 'axios'
import useAuth from './useAuth'
import GetLetterPicture from '../components/utils/GetLetterPicture'

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
		const name = data.name
		let avatar = data.avatar

		if (!avatar) {
			avatar = GetLetterPicture(name)
		}

		setAuth((prev) => {
			return { ...prev, email, accessToken, roles, id, name, avatar }
		})

		return accessToken
	}

	return refresh
}

export default useRefreshToken
