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
    const isAdmin = data.isAdmin ? true : false
    const id = data.id
    const name = data.name
    const avatar = data.avatar
    const notification = data.notification
    const avatarPath = data.avatarPath
    const SDSPath = data.SDSPath
    const subscriber = data.subscriber
    const isUnsubscribed = data.isUnsubscribed ? true : false
    const isProfileNotCompleted = data.isProfileNotCompleted ? true : false

    setAuth((prev) => ({
      ...prev,
      email,
      accessToken,
      roles,
      isAdmin,
      id,
      name,
      avatar,
      notification,
      avatarPath,
      SDSPath,
      subscriber,
      isUnsubscribed,
      isProfileNotCompleted,
    }))

    return accessToken
  }

  return refresh
}

export default useRefreshToken
