import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
	const { setAuth } = useAuth()
	const navigate = useNavigate()

	const logout = async () => {
		setAuth({})

		document.cookie =
			'refreshToken=; secure; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'

		navigate('/login')
	}

	return logout
}

export default useLogout
