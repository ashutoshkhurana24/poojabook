'use client'

import { useEffect, useState, useRef } from 'react'

export default function NotificationPrompt() {
  const [show, setShow] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dismissed = localStorage.getItem('poojabook_notification_dismissed')
    if (dismissed === 'true') {
      setShow(false)
    }
  }, [])

  const handleClick = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }
    
    if (Notification.permission === 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🔔 PoojaBook', {
            body: 'Notifications enabled!',
            icon: '/favicon.svg'
          })
        }
      })
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Permission result:', permission)
        if (permission === 'granted') {
          new Notification('🔔 PoojaBook', {
            body: 'Notifications enabled!',
            icon: '/favicon.svg'
          })
        }
      })
    } else {
      alert('Notifications are blocked in browser settings')
    }
    
    setShow(false)
  }

  const handleLater = () => {
    localStorage.setItem('poojabook_notification_dismissed', 'true')
    setShow(false)
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
              ref={buttonRef}
              onClick={handleClick}
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
