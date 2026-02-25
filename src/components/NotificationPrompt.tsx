'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    OneSignal: any
  }
}

export default function NotificationPrompt() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const dismissed = localStorage.getItem('poojabook_notification_dismissed')
    const enabled = localStorage.getItem('poojabook_notification_enabled')

    if (!dismissed && !enabled) {
      const timer = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAllow = async () => {
    setLoading(true)
    
    try {
      // Request browser notification permission
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        localStorage.setItem('poojabook_notification_enabled', 'true')
        
        // Try OneSignal if available
        if (window.OneSignal) {
          await window.OneSignal.init({
            appId: "YOUR_ONESIGNAL_APP_ID",
            allowLocalhostAsSecureOrigin: true,
            autoRegister: true,
          })
        }
        
        // Show test notification
        new Notification('🔔 PoojaBook', {
          body: 'Notifications enabled! You will receive updates about poojas.',
          icon: '/favicon.svg'
        })
        
        alert('✅ Notifications enabled!')
        setShow(false)
      } else {
        alert('Please enable notifications in browser settings')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error enabling notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleLater = () => {
    localStorage.setItem('poojabook_notification_dismissed', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 right-5 z-50 max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔔</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Stay Updated!</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get notified about upcoming poojas, discounts, and festivals.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700"
              >
                {loading ? 'Enabling...' : 'Allow'}
              </button>
              <button
                onClick={handleLater}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
