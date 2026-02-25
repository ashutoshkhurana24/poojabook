'use client'

import { useEffect, useState, useRef } from 'react'

export default function NotificationPrompt() {
  const [notification, setNotification] = useState<{title: string, body: string} | null>(null)
  const [notifs, setNotifs] = useState<Array<{title: string, body: string, id: number}>>([])
  const initialized = useRef(false)
  const counter = useRef(0)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const processNotifications = (notifs: Array<{title: string, body: string}>) => {
      notifs.forEach((n) => {
        const id = ++counter.current
        setNotifs(prev => [...prev, { ...n, id }])
        setTimeout(() => {
          setNotifs(prev => prev.filter(x => x.id !== id))
        }, 6000)
      })
    }

    // Check for stored notifications
    const stored = localStorage.getItem('poojabook_notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        processNotifications(parsed)
        localStorage.removeItem('poojabook_notifications')
      } catch (e) {}
    }

    // Listen for storage events (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'poojabook_notifications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          processNotifications(parsed)
          localStorage.removeItem('poojabook_notifications')
        } catch (e) {}
      }
    }
    window.addEventListener('storage', handleStorage)

    // Listen for custom notification event
    const handleNotif = (e: CustomEvent) => {
      const id = ++counter.current
      setNotifs(prev => [...prev, { ...e.detail, id }])
      setTimeout(() => {
        setNotifs(prev => prev.filter(x => x.id !== id))
      }, 6000)
    }
    window.addEventListener('poujabook-notification', handleNotif as EventListener)
    window.addEventListener('poojabook-notification', handleNotif as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('poujabook-notification', handleNotif as EventListener)
      window.removeEventListener('poojabook-notification', handleNotif as EventListener)
    }
  }, [])

  // Show demo notification every 30 seconds for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      const id = ++counter.current
      setNotifs(prev => [...prev, { 
        title: '🔔 Welcome to PoojaBook', 
        body: 'Browse divine poojas and book your spiritual journey!',
        id 
      }])
      setTimeout(() => {
        setNotifs(prev => prev.filter(x => x.id !== id))
      }, 6000)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  if (notifs.length === 0) return null

  return (
    <>
      {notifs.map(n => (
        <div key={n.id} style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          backgroundColor: '#ea580c',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 99999,
          maxWidth: '400px',
          marginBottom: '10px',
          animation: 'slideIn 0.3s ease'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{n.title}</div>
          <div style={{ fontSize: '14px' }}>{n.body}</div>
        </div>
      ))}
    </>
  )
}
