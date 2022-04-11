import axios from 'axios'
//axios.defaults.baseURL = 'https://scims-api.steammersheng.com'

const axiosPrivate = axios.create({
	headers: {
		'Content-Type': 'application/json',
		withCredentials: true,
	},
})

export default axiosPrivate
