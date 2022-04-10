import { useState, useEffect } from 'react'

const checkIsMobile = () => {
	const { innerWidth: width } = window

	return width < 1024
}

const useMobile = () => {
	const [isMobile, setIsMobile] = useState(checkIsMobile())

	useEffect(() => {
		function handleResize() {
			setIsMobile(checkIsMobile())
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return isMobile
}

export default useMobile
