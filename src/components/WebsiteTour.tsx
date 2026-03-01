'use client'

import { useEffect, useState } from 'react'
import { isTourCompleted, startTour } from '@/lib/tour-steps'

export default function WebsiteTour() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Auto-trigger for first-time visitors after 2 seconds
    if (typeof window !== 'undefined' && !isTourCompleted()) {
      setTimeout(() => {
        startTour()
        window.dispatchEvent(new CustomEvent('start-poojabook-tour'))
      }, 2000)
    }
  }, [])

  const handleStartTour = () => {
    console.log('Tour button clicked!')
    startTour()
    window.dispatchEvent(new CustomEvent('start-poojabook-tour'))
  }

  if (!mounted) return null

  return (
    <button
      onClick={handleStartTour}
      className="fixed bottom-36 right-5 z-[70] bg-orange-600 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-orange-700 transition flex items-center gap-2 font-semibold"
      style={{ boxShadow: '0 6px 25px rgba(234, 88, 12, 0.5)' }}
    >
      <span className="text-xl">🎯</span> 
      <span>Take Tour</span>
    </button>
  )
}
