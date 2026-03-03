'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'

interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: string
}

export function Header() {
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Array<{title: string, body: string, time: string, read: boolean}>>([])
  const [notification, setNotification] = useState<{title: string, body: string} | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data)
      })
      .catch(() => {})
  }, [pathname])

  useEffect(() => {
    const stored = localStorage.getItem('poojabook_notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const newNotifs = parsed.map((n: {title: string, body: string}) => ({
          ...n,
          time: new Date().toLocaleTimeString(),
          read: false
        }))
        setNotifications(prev => [...newNotifs, ...prev].slice(0, 20))
        localStorage.removeItem('poojabook_notifications')
      } catch (e) {}
    }
    
    // Demo notification after 5 seconds
    const timer = setTimeout(() => {
      const demoNotif = { 
        title: '🔔 Welcome to PoojaBook', 
        body: 'Browse divine poojas and book your spiritual journey!',
        time: new Date().toLocaleTimeString(),
        read: false
      }
      setNotifications(prev => [demoNotif, ...prev].slice(0, 20))
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleNotif = (e: CustomEvent) => {
      const newNotif = { ...e.detail, time: new Date().toLocaleTimeString(), read: false }
      setNotifications(prev => [newNotif, ...prev].slice(0, 20))
      setNotification(e.detail)
      setTimeout(() => setNotification(null), 5000)
    }
    window.addEventListener('poojabook-notification', handleNotif as EventListener)
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'poojabook_notifications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          const newNotifs = parsed.map((n: {title: string, body: string}) => ({
            ...n,
            time: new Date().toLocaleTimeString(),
            read: false
          }))
          setNotifications(prev => [...newNotifs, ...prev].slice(0, 20))
          localStorage.removeItem('poojabook_notifications')
        } catch (e) {}
      }
    }
    window.addEventListener('storage', handleStorage)
    
    return () => {
      window.removeEventListener('poojabook-notification', handleNotif as EventListener)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  const isAdmin = user?.role === 'ADMIN'
  const isVendor = user?.role === 'VENDOR'
  const isPartner = user?.role === 'PANDIT' || user?.role === 'TEMPLE'
  const isCustomer = user?.role === 'CUSTOMER'

  return (
    <>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '100px',
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
      )}
      <header className="bg-surface shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-heading text-xl">🪔</span>
            </div>
            <span className="font-heading text-2xl text-primary">PoojaBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/poojas" className="text-text-secondary hover:text-primary font-medium">
              {t('nav.browsePoojas')}
            </Link>
            <Link href="/poojas?mode=IN_TEMPLE" className="text-text-secondary hover:text-primary font-medium">
              {t('nav.templePoojas')}
            </Link>
            <Link href="/poojas?mode=AT_HOME" className="text-text-secondary hover:text-primary font-medium">
              {t('nav.atHome')}
            </Link>
            <Link href="/calendar" className="text-text-secondary hover:text-primary font-medium">
              {t('nav.calendar')}
            </Link>
            <Link href="/guide" className="text-text-secondary hover:text-primary font-medium">
              {t('nav.poojaGuide')}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-text-secondary hover:text-primary transition flex items-center"
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-lg border py-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-2 border-b flex justify-between items-center">
                    <p className="font-medium text-gray-900">{t('nav.notifications')}</p>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        {t('nav.clearAll')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-gray-500 text-sm">
                        {t('nav.noNotifications')}
                      </p>
                    ) : (
                      notifications.map((n, i) => (
                        <div 
                          key={i} 
                          className={`px-4 py-3 border-b hover:bg-background ${!n.read ? 'bg-orange-50' : ''}`}
                        >
                          <p className="font-medium text-sm text-gray-900">{n.title}</p>
                          <p className="text-sm text-gray-600">{n.body}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition"
                >
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg border py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email || user.phone}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-background">
                        {t('nav.adminDashboard')}
                      </Link>
                    )}

                    {(isVendor || isPartner) && (
                      <Link href="/vendor" className="block px-4 py-2 text-sm hover:bg-background">
                        {t('nav.myDashboard')}
                      </Link>
                    )}

                    {isPartner && (
                      <Link href="/vendor/listings" className="block px-4 py-2 text-sm hover:bg-background">
                        {t('nav.myListings')}
                      </Link>
                    )}

                    <Link href="/my-orders" className="block px-4 py-2 text-sm hover:bg-background">
                      {t('nav.myBookings')}
                    </Link>

                    {isCustomer && (
                      <>
                        <Link href="/saved" className="block px-4 py-2 text-sm hover:bg-background">
                          {t('nav.savedPoojas')}
                        </Link>
                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-background">
                          {t('nav.profileSettings')}
                        </Link>
                      </>
                    )}

                    {(isVendor || isPartner) && (
                      <Link href="/vendor/settings" className="block px-4 py-2 text-sm hover:bg-background">
                        {t('nav.partnerSettings')}
                      </Link>
                    )}

                    <div className="border-t my-1" />

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-background"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-text-secondary hover:text-primary font-medium">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition">
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
