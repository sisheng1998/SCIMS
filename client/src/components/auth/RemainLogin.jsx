import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '../../hooks/useRefreshToken'
import useAuth from '../../hooks/useAuth'

const RemainLogin = () => {
	const [isLoading, setIsLoading] = useState(true)
	const refresh = useRefreshToken()
	const { auth } = useAuth()

	useEffect(() => {
		let isMounted = true

		const verifyRefreshToken = async () => {
			try {
				await refresh()
			} catch (error) {
				return
			} finally {
				isMounted && setIsLoading(false)
			}
		}

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

		return () => {
			isMounted = false
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <>{isLoading ? null : <Outlet />}</>
}

export default RemainLogin
