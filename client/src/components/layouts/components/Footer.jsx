import React from 'react'
import { useLocation } from 'react-router-dom'
import useMobile from '../../../hooks/useMobile'

const Footer = () => {
	const { pathname } = useLocation()
	const isMobile = useMobile()

	let marginBottom = ''
	if (isMobile && pathname === '/') {
		marginBottom = 'mb-[81px]'
	}

	return (
		<footer
			className={`flex items-center justify-between space-x-6 border-t border-gray-200 px-6 py-3 pl-[calc(73px+24px)] text-xs tracking-wide xl:pr-4 xl:pl-[calc(61px+16px)] lg:pl-4 ${marginBottom}`}
		>
			<p>Smart Chemical Inventory Management System</p>
			<p>Version 1.0.0</p>
		</footer>
	)
}

export default Footer
