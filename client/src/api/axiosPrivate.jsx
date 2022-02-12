import axios from 'axios'

const axiosPrivate = axios.create({
	headers: {
		'Content-Type': 'application/json',
		withCredentials: true,
	},
})

export default axiosPrivate
