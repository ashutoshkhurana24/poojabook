'use client'

import { useState, useEffect } from 'react'
import { requestNotificationPermission } from '@/lib/firebase'

interface NotificationPromptProps {
  onComplete?: (granted: boolean) => void
}

export default function NotificationPrompt({ onComplete }: NotificationPromptProps) {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const permission = localStorage.getItem('poojabook_notification_permission')
    const dismissedBefore = localStorage.getItem('poojabook_notification_dismissed')

    if (!permission && !dismissedBefore) {
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }

    if (permission === 'granted' && onComplete) {
      onComplete(true)
    }
  }, [onComplete])

  const handleAllow = async () => {
    setLoading(true)
    try {
      console.log('Requesting notification permission...')
      const token = await requestNotificationPermission()
      console.log('Token received:', token ? 'yes' : 'no')
      
      if (token) {
        localStorage.setItem('poojabook_notification_permission', 'granted')
        
        const res = await fetch('/api/notifications/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        console.log('Registration response:', data)
        
        setShow(false)
        onComplete?.(true)
      } else {
        localStorage.setItem('poojabook_notification_permission', 'denied')
        setShow(false)
        onComplete?.(false)
      }
    } catch (error) {
      console.error('Notification error:', error)
      localStorage.setItem('poojabook_notification_permission', 'denied')
      setShow(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLater = () => {
    localStorage.setItem('poojabook_notification_dismissed', 'true')
    setDismissed(true)
    setShow(false)
  }

  if (!show || dismissed) return null

  return (
    <div className="fixed bottom-20 right-5 z-50 max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🔔</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Stay Updated!</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get notified about upcoming poojas, exclusive discounts, and festival reminders.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition disabled:opacity-50"
                style={{ backgroundColor: '#C85A28' }}
              >
                {loading ? 'Allowing...' : 'Allow'}
              </button>
              <button
                onClick={handleLater}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition"
              >
                Later
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleLater}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
