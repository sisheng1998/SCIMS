import axios from 'axios'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

const useLogout = (options) => {
	const { auth, setAuth } = useAuth()
	const navigate = useNavigate()

	const logout = async () => {
		setAuth({})

		try {
			await axios.put('/api/auth/logout', {
				allDevices: options === 'All Devices',
				userId: auth.id,
				withCredentials: true,
			})

			navigate('/login')
		} catch (error) {
			navigate('/login')
		}
	}

	return logout
}

export default useLogout
