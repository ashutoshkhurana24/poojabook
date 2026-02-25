'use client'

import { useState, useEffect } from 'react'

export default function NotificationPrompt() {
  const [show, setShow] = useState(false)
  const [notification, setNotification] = useState<{title: string, body: string} | null>(null)

  useEffect(() => {
    const dismissed = localStorage.getItem('poojabook_notification_dismissed')
    const enabled = localStorage.getItem('poojabook_notification_enabled')

    if (!dismissed && !enabled) {
      const timer = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(timer)
    }
    
    // Also listen for custom notification event
    const handleNotif = (e: CustomEvent) => {
      setNotification(e.detail)
      setTimeout(() => setNotification(null), 5000)
    }
    window.addEventListener('poojabook-notification', handleNotif as EventListener)
    return () => window.removeEventListener('poojabook-notification', handleNotif as EventListener)
  }, [])

  const handleAllow = () => {
    localStorage.setItem('poojabook_notification_enabled', 'true')
    setShow(false)
    
    // Dispatch event that main page can listen to
    window.dispatchEvent(new CustomEvent('poojabook-notification', {
      detail: { title: '🔔 PoojaBook', body: 'Notifications enabled!' }
    }))
  }

  const handleLater = () => {
    localStorage.setItem('poojabook_notification_dismissed', 'true')
    setShow(false)
  }

  // Show notification if triggered
  if (notification) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#ea580c',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        zIndex: 99999,
        maxWidth: '400px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{notification.title}</div>
        <div style={{ fontSize: '14px' }}>{notification.body}</div>
      </div>
    )
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '320px',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#ffedd5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🔔
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: '600', marginBottom: '4px', color: '#111' }}>Stay Updated!</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
            Get notified about upcoming poojas and discounts.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAllow}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#ea580c',
                color: 'white',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Allow
            </button>
            <button
              onClick={handleLater}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
