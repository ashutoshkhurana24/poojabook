'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notification, setNotification] = useState<{title: string, body: string} | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
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
    const handleNotif = (e: CustomEvent) => {
      setNotification(e.detail)
      setTimeout(() => setNotification(null), 5000)
    }
    window.addEventListener('poojabook-notification', handleNotif as EventListener)
    return () => window.removeEventListener('poojabook-notification', handleNotif as EventListener)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
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
              Browse Poojas
            </Link>
            <Link href="/poojas?mode=IN_TEMPLE" className="text-text-secondary hover:text-primary font-medium">
              Temple Poojas
            </Link>
            <Link href="/poojas?mode=AT_HOME" className="text-text-secondary hover:text-primary font-medium">
              At Home
            </Link>
            <Link href="/calendar" className="text-text-secondary hover:text-primary font-medium">
              Hindu Calendar
            </Link>
          </nav>

          <div className="flex items-center gap-4">
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
                        Admin Dashboard
                      </Link>
                    )}
                    
                    {(isVendor || isPartner) && (
                      <Link href="/vendor" className="block px-4 py-2 text-sm hover:bg-background">
                        My Dashboard
                      </Link>
                    )}
                    
                    {isPartner && (
                      <Link href="/vendor/listings" className="block px-4 py-2 text-sm hover:bg-background">
                        My Listings
                      </Link>
                    )}
                    
                    <Link href="/my-orders" className="block px-4 py-2 text-sm hover:bg-background">
                      My Bookings
                    </Link>
                    
                    {isCustomer && (
                      <>
                        <Link href="/saved" className="block px-4 py-2 text-sm hover:bg-background">
                          Saved Poojas
                        </Link>
                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-background">
                          Profile Settings
                        </Link>
                      </>
                    )}
                    
                    {(isVendor || isPartner) && (
                      <Link href="/vendor/settings" className="block px-4 py-2 text-sm hover:bg-background">
                        Partner Settings
                      </Link>
                    )}
                    
                    <div className="border-t my-1" />
                    
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-background"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-text-secondary hover:text-primary font-medium">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
