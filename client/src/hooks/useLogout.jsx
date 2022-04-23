import axios from 'axios'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
	const { setAuth } = useAuth()
	const navigate = useNavigate()

	const logout = async () => {
		setAuth({})

		try {
			await axios.put('/api/auth/logout', {
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
