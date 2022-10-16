import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUpIcon } from '@heroicons/react/outline'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  const [isVisible, setIsVisible] = useState(false)

  const setVisible = () => setIsVisible(window.pageYOffset > 300)

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  useEffect(() => {
    window.addEventListener('scroll', setVisible)

    return () => window.removeEventListener('scroll', setVisible)
  }, [])

  return (
    pathname !== '/' && (
      <div
        className={`fixed bottom-2 left-2 z-10 -translate-y-12 ${
          isVisible ? '' : 'pointer-events-none'
        }`}
      >
        <button
          className={`inline-flex items-center rounded-lg border-2 border-indigo-600 p-2 text-indigo-600 shadow-sm outline-none transition ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          }`}
          onClick={scrollToTop}
        >
          <ArrowUpIcon className='h-5 w-5 stroke-2' aria-hidden='true' />
        </button>
      </div>
    )
  )
}

export default ScrollToTop
