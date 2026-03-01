'use client'

import { useEffect } from 'react'

export default function CrossPageTour() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.min.js'
    script.onload = () => {
      console.log('Driver.js loaded')
    }
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.href = 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  return null
}
